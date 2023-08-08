const fs = require("fs");
const { MongoClient } = require("mongodb");
const Function = require("../functions.js");

class Database{
  constructor(name){
    let datas = Function.getNameOfDatabase(name);
    this.collectionName = datas.collection; this.databaseName = datas.database;
    this.mongoconfig = {};
    try{this.mongoconfig = JSON.parse(fs.readFileSync(`${process.env.CONFIGDIR}/config.json`))}catch{return {error: true, errorCode: "001"}};
    this.client = new MongoClient(this.mongoconfig['MONGO_URI']);
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