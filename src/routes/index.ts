import { Application } from 'express';

import IAMRouter from './iam';

let routes = (app: Application) => {
    app.use("/api/iam", IAMRouter);
};

export default routes;