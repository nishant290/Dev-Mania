import 'dotenv/config'
import connectDB from "./src/db/db.js";
import { app } from './app.js';

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
            console.log(`App listening on port:${process.env.PORT}`);               
        })
})
.catch((err)=>{
    console.error("OOPS, CONNECTION PROBLEM !!",err);    
});
