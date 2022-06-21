import express from 'express';

const HealthcheckRouter = express.Router();

HealthcheckRouter.get('/', (req, res) => {
  res.status(200).json({
    message: 'Ok',
  });
});

export default HealthcheckRouter;
