import express, {Request,Response} from "express";
import Book from "./book";
import bodyParser from "body-parser";
import serverStatic from "serve-static";
import mongoose from "mongoose";
import cors from "cors";

const app=express();
app.use(bodyParser.json());
app.use(serverStatic("Public"));
app.use(cors());

const uri:string="mongodb://localhost:27017/Libearly";
mongoose.connect(uri,(err)=>{
    if(err){ console.log(err); }
    else{ console.log("Mongo db connection sucess");}
});

 app.get("/",(req:Request,res:Response)=>{
     res.send("hello world");
 });

app.get("/books",(req:Request,res:Response)=>{
    Book.find((err,books)=>{
        if (err){res.status(500).send(err);}
        else{ res.send(books);}
    })
});


app.get("/books/:id",(req:Request,res:Response)=>{
    Book.findById(req.params.id,(err: any,books: any)=>{
        if (err){res.status(500).send(err);}
        else{ res.send(books);}
    })
});

app.post("/books",(req:Request,res:Response)=>{
    let book=new Book(req.body);
    book.save(err=>{
        if (err){res.status(500).send(err);}
        else res.send(book);
    })
});

app.put("/books/:id",(req:Request,res:Response)=>{
    Book.findByIdAndUpdate(req.params.id,req.body,(err: any,book: any)=>{
        if (err){res.status(500).send(err);}
        else {
            res.send("successfly updated book");
        }
    })
});

app.delete("/books/:id",(req:Request,res:Response)=>{
    Book.deleteOne({_id:req.params.id},err=>{
        if (err){res.status(500).send(err);}
        else {
            res.send("  book deleted");
        }
    });
});


app.get("/pbooks",(req:Request,res:Response)=>{
    let p:number = parseInt(req.query.page?.toString() || "1" );
    let size:number = parseInt(req.query.size?.toString() || "5");

    Book.paginate({}, { page:p,limit:size}, function(err,result){
        if (err){res.status(500).send(err);}
        else res.send(result);
    })
});
  
app.get("/books-search",async (req:Request,res:Response)=>{
    let p:number = parseInt(req.query.page?.toString() || "1" );
    let size:number = parseInt(req.query.size?.toString() || "5");
    let keyword = req.query.search || '';

    await Book.paginate({}, {page: p, limit: size}, (err: any, books: any) => {
        if (err) {
            res.status(455).send(err);
        } else res.send(books);
    });
});


app.listen(8708, ()=>{
    console.log("server started on port %d",8708);
});

module.exports=app;

