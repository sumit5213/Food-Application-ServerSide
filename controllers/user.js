
const dotenv = require("dotenv");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const Orders = require("../models/orders")

dotenv.config();

const error = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
};

async function UserRegisteration(req, res, next) {
    try {
        const { name, email, password, image } = req.body;
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return next(error(409, "email is already existed"));
        }

        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt);

        const user = await  User.create({
            name, email, password: hashPassword, image,
        })
        // const createdUser = await user.save();
        const token = jwt.sign({
            id: user.id,},
            process.env.JWT
        );

        return res.status(201).json({ token, user });
    }
    catch (err) { 
        next(err); 
    }
}


async function UserLogin(req,res,next){
    try{const{email,password} = req.body;
    const user = await User.findOne({email:email}).exec();
    if(!user){
        return next(error(409,"user not found"));
    }
    const isPasswordCorrect = await bcrypt.compareSync(password,user.password);
    // const  isPasswordCorrect = async ()=>{
    //     await bcrypt.compare(password,user.password,(err,res)=>{
    //         console.log(res)
    //     });
    // }

    // bcrypt.compa
    // User.findOn

    if(!isPasswordCorrect){
        return next(error(403,"Incorrect Password"))
    }

    const token = jwt.sign({
        id:user.id},
        process.env.JWT
    )

    return res.status(201).json({token,user})
    }
    catch (err) {
        next(err);
      }
}


module.exports = { UserRegisteration , UserLogin
}