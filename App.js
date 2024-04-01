import express from 'express'
import CourseRoutes from "./Kanbas/courses/routes.js";
import Hello from "./Hello.js"
import Lab5 from './Lab5.js';
import cors from 'cors';
import ModuleRoutes from './Kanbas/modules/routes.js';

const app = express()
app.use(cors());
app.use(express.json());
CourseRoutes(app);
ModuleRoutes(app);
Lab5(app);
Hello(app);
app.listen(process.env.PORT || 4000);