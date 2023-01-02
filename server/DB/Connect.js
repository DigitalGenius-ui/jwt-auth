import mongoose from "mongoose";

export const connectDb = () => {
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("database is connected"))
    .catch((err) => console.log(err));
};
