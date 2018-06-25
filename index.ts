import { Server } from 'hapi';
import * as Boom from 'boom';
import * as path from 'path'
import * as fs from 'fs';
import * as Loki from 'lokijs';

import {
    imageFilter, loadCollection, cleanFolder,
    uploader
} from './utils';

// setup
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const fileOptions: FileUploaderOption = { dest: `${UPLOAD_PATH}/`, fileFilter: imageFilter };
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });

// optional: clean all data before start
// cleanFolder(UPLOAD_PATH);
if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH);

// app
const app = new Server({
    port: 3001,
    host: 'localhost',
    routes: {
        cors: {
            credentials: true
        }
    }
});

const db_user = require('./models/index')
console.log(db_user)
//Connect database
var initDb = function(){
    var sequelize = db_user.sequelize;
    //Determine if the database connection is successful
     sequelize.sync({force: false}).then(function() {
        console.log("connection successed");
     }).catch(function(err){
        console.log("connection failed due to error: %s", err);
     });    
};
initDb();

const route=require('./routes');
// Add the server routes
route.forEach(function(api){
    app.route(api);
});

async function register_plugins() {
    app.register({
        plugin: require('hapi-server-session'),
        options: {
          cookie: {
            isSecure: false, // never set to false in production
          },
        },
      });
}

app.route({
    method: 'POST',
    path: '/profile',
    options: {
        payload: {
            output: 'stream',
            allow: 'multipart/form-data'
        }
    },
    handler: async function (request, h) {
        try {
            const data = request.payload;
            const file = data['avatar'];

            const fileDetails = await uploader(file, fileOptions);
            const col = await loadCollection(COLLECTION_NAME, db);
            const result = col.insert(fileDetails);

            db.saveDatabase();
            return { id: result.$loki, fileName: result.filename, originalName: result.originalname };
        } catch (err) {
            return Boom.badRequest(err.message, err);
        }
    }
});

app.route({
    method: 'POST',
    path: '/photos/upload',
    options: {
        payload:{
            output: 'stream',
            allow: 'multipart/form-data'
        }
    },
    handler: async (request, h) => {
        try {
            const data = request.payload;
            const files = data['file'];
            const filesDetails = await uploader(files, fileOptions);
            const col = await loadCollection(COLLECTION_NAME, db);
            const result = [].concat(col.insert(filesDetails));

            db.saveDatabase();
            return result.map(x => ({ id: x.$loki, fileName: x.filename, originalName: x.originalname, status: 1, image_path: 'http://localhost:3001/images/' + x.$loki}));
        } catch (err) {
            return Boom.badRequest(err.message, err);
        }
    }
});

app.route({
    method: 'GET',
    path: '/images',
    handler: async (request, h) => {
        try {
            const col = await loadCollection(COLLECTION_NAME, db);
            return col.data;
        } catch (err) {
            return Boom.badRequest(err.message, err);
        }
    }
});

app.route({
    method: 'GET',
    path: '/images/{id}',
    handler: async (request, h) => {
        try {
            const col = await loadCollection(COLLECTION_NAME, db)
            const result = col.get(+request.params['id']);

            if (!result) {
                return Boom.notFound();
            };

            return fs.createReadStream(path.join(UPLOAD_PATH, result.filename));
        } catch (err) {
            return Boom.badRequest(err.message, err);
        }
    }
});

let controllers=require('./controllers')

//注册
app.route({
    method: 'POST',
    path: '/register',
    options: {
        payload:{
            output: 'stream',
            allow: 'application/json'
        }
    },
    handler: controllers.user.register
});

const init = async () => {
    await register_plugins()
    await app.start();
    console.log(`Server running at: ${app.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();