console.clear();
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dataBase from "./config/ormconfig";
import rootRoutes from "./routes/index.routes";
import morgan from "morgan";
import backup from "./scripts/backupDatabase";

dotenv.config();  

const bootstrap = async () => {
    await dataBase.initialize();
    
    const app = express();
  
    app.use(bodyParser.json());
    app.use(cors());
    app.use(morgan("dev"));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(rootRoutes);
    
    app.listen(3000 || process.env.PORT , () => { 
        console.log("Server started on port 3000");
    }
    );
    backup();   
}

bootstrap();

