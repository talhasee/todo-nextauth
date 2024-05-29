import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    await dbConnect();

    try {
        const {email, password} = await request.json();

        //EXISTING USER CHECKING    
        const exisitingUser = await userModel.findOne({
            email
        });

        if(exisitingUser){
            return Response.json({
                success: false,
                message: "Email already in use",
            },
            {
                status: 400
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            email,
            password: hashedPassword,
            todos: []
        });


        await newUser.save();

        return Response.json({
            success: true,
            message: "User created Successfully",
            user: newUser
            }, 
            {
            status: 201    
            })
    } catch (error) {
        console.error(`Error registering user`, error);

        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
        
    }
}