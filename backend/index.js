import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json())


//Connection to database
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Database connected Successfully"))
    .catch((err)=> console.log("Failed to connect", err))

const urlschema = new mongoose.Schema({

    originalUrl:String,
    shortUrl:String,
    clicks: { type:Number, default: 0},
});


//Creating the Model:
const Url = mongoose.model('Url', urlschema)


app.post('/api/short', async (req, res)=>{
    try{
        const { originalUrl } = req.body;
        if(!originalUrl) return res.status(400).json({ error: 'originalUrl error'})
        const shortUrl = nanoid(8)
        const url = new Url({ originalUrl, shortUrl })
        await url.save();
        return res.status(200).json({message: "URL Generated", url: url})
    }catch (err){
        console.log(error)
        res.status(500).json({error: 'Server error'});
        
    }
})


// app.get('/:shortUrl', async(req,res) => {
//     try {
//         const {shortUrl } = req.params;
//         const url = await Url.findOne({ shortUrl });
//         console.log("url found", url);
        
//     } catch (error) {
        
//     }
// })

app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
  
    try {
      const urlEntry = await Url.findOne({ shortUrl });
  
      if (!urlEntry) {
        return res.status(404).json({ message: 'Short URL not found' });
      }
  
      // Increment click count
      urlEntry.clicks += 1;
      await urlEntry.save();
  
      // Redirect to the original URL
      res.redirect(urlEntry.originalUrl);
    } catch (error) {
      res.status(500).json({ message: 'Error redirecting', error: error.message });
    }
  });












app.listen(3000, () => console.log("Server is running on port 3000"));

