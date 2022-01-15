import express from "express";

export const router = express.Router();

router.post("/", async (req, res) => {
    res.send({text:'hello'});
    console.log(req.body.text);
});