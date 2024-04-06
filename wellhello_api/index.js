const express = require('express')
const app = express()
const ticketSchema = require("./schemas/tickets_schema.schema");

const mongoose = require('mongoose');

const QUERY_KEY = "text";

main().catch(err => console.log(err));

const createDatabase = async ()=>{
    try{
        const Tickets = mongoose.model('Tickets', ticketSchema);
        listOfTickets = await Tickets.find();
        if (!(listOfTickets.length)){
            console.log("Createing tickets...")
            for (let i = 1; i <= 1350; i++){
                console.log(`Ticket with id ${i} have been created`);
                let newTicket = new Tickets({ id: i, status : false, time : new Date() });
                await newTicket.validate();
                await newTicket.save();
            }
        }
        else{
            console.log("Tickets have been already created");
        }
    }catch{
        console.error("Couldn't connect to the database")
    }
    
};

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/tickets');
}

app.get('/activate-ticket', async (req, res) => {
    const id = req.query[QUERY_KEY];
    const Tickets = mongoose.model('Tickets', ticketSchema);
    if (id){
    let ticket = await Tickets.findOne({$and : [{id : id}, {status : false}]});
    if (ticket){
        update = (await Tickets.updateOne({id : id}, {status : true, time : new Date()}));
        if (update.matchedCount){
            res.send({error : false, message : "A jegyet sikeresen akitválta"});
        }else{
            res.send({
                error : true,
                message : "Something went wrong"
            })
        }

    }
    else{
        res.send({
            error : true,
            message : "A jegy nem található vagy már aktiválva lett",
        })
    }
    }else{
        res.send({
            error : true,
            message : "Hibás adatok"
        })
    }
})

app.get("/deactivate-ticket", async (req,res)=>{
    const id = req.query[QUERY_KEY];
    const Tickets = mongoose.model('Tickets', ticketSchema);
    if (id){
    let ticket = await Tickets.findOne({$and : [{id : id}, {status : true}]});
    if (ticket){
        update = (await Tickets.updateOne({id : id}, {status : false, time : new Date()}));
        if (update.matchedCount){
            res.send({error : false, message : "A jegyet sikeresen deakitválta"});
        }else{
            res.send({
                error : true,
                message : "Something went wrong"
            })
        }

    }
    else{
        res.send({
            error : true,
            message : "A jegy nem található vagy még nem lett aktiválva",
        })
    }
    }else{
        res.send({
            error : true,
            message : "Hibás adatok"
        })
    }
});

createDatabase();
app.listen(3000);