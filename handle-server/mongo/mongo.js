const fs = require("fs");
const { MongoClient } = require("mongodb");
const Function = require("../functions.js");

const config = JSON.parse(fs.readFileSync(`${process.env.CONFIGDIR}/config.json`));

class Database{
  constructor(name){
    let datas = Function.getNameOfDatabase(name);
    this.collectionName = datas.collection; this.databaseName = datas.database;
    this.mongoconfig = {};
    if (!this.mongoconfig) return {error : true};
    this.client = new MongoClient(config['MONGO_URI']);
    this.Db();
    let db = this.client.db(this.databaseName);
    this.createCollection();
    this.collection = db.collection(this.collectionName);
    return {collection : this.collection, database : this.client};
  }

  async createCollection(){
    try{
      await this.client.createCollection(this.collection);
    }
    catch{
      return false;
    }
  }

  async Db(){
    await this.client.connect();
  }
}

module.exports = Database;