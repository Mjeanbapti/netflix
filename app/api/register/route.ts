import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function POST(req: NextRequest, res: NextResponse){

    try{
        const body = await req.json();
        const { email,  name, password } = body;

        const existingUser = await prismadb.user.findUnique({
            where: {
                email
            }
        });

        if(existingUser) {
            return NextResponse.json({error: 'Email taken'});
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prismadb.user.create({
            data:{
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            }
        });
        return NextResponse.json(user);
    } catch (error){

    }
}
