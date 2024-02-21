import asynchHandler from 'express-async-handler'
import { prisma }from '../config/prismaConfig.js'

export const createUser = asynchHandler(async(req, res) => {
    console.log("Creating a user");

    let { email } = req.body;
    const userExists = await prisma.user.findUnique({where: {email: email}})

    if (!userExists) 
    {
        const user = await prisma.user.create({data: req.body});
        res.send({
            message: "User registered successfully",
            user: user,
        })
    } else res.status(201).send({ message: "User already registered"});
});

//function to book a visit to residency
export const bookVisit = asynchHandler(async(req, res)=>{
    const {email, data} = req.body
    const {id} = req.params

    try{
        const alreadyBooked = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true}
        })

        if(alreadyBooked.bookedVisits.some((visit)=> visit.id == id))
        {
            res.status(400).json({message: "This residency is already booked by you"})
        }
        else{
            await prisma.user.update({
                where: {email: email},
                data: {
                    bookedVisits: {push: {id, data}}
                },
            });
            res.send("your visit is booked succesfully")
        }
    }catch(err)
    {
        throw new Error(err.message)
    }
})

// funtion to get all bookings of a user
export const getAllBookings = asynchHandler(async (req, res) => {
    const { email } = req.body;
    try {
      const bookings = await prisma.user.findUnique({
        where: { email },
        select: { bookedVisits: true },
      });
      res.status(200).send(bookings);
    } catch (err) {
      throw new Error(err.message);
    }
  });

  //function to cancel a booking
  export const cancelBooking = asynchHandler (async (req,res) => {
    const {email} = req.body;
    const {id} = req.params;
    try{
        
        const user = await prisma.user.findUnique({
            where: {email: email},
            select: {bookedVisits: true}
        })
        const index = user.bookedVisits.findIndex((visit)=> visit.id === id)

        if(index === -1){
            res.status(404).json({message: "Booking not found"})
        } else {
            user.bookedVisits.splice(index, 1)
            await prisma.user.update({
                where: {email},
                data: {
                    bookedVisits: user.bookedVisits
                }
            })

            res.send("Booking cancelled successfully")
        }
        
    }catch(err){
        throw new Error(err.message)
    }
    
    
  })

  // function to add a resd in favourite list of a user
  export const toFav = asynchHandler(async(req, res)=>{
    const {email} = req.body;
    const {rid} = req.params;
    try{
        
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if(user.favResidanciesiD.includes(rid))
        {
            const updateUser = await prisma.user.update({
                where: {email},
                data: {
                    favResidanciesiD: {
                        set: user.favResidanciesiD.filter((id)=> id !== rid)
                    }
                }
            });

            res.send({message: "Removed from favourites", user: updateUser})
        } else {
            const updateUser = await prisma.user.update({
                where: {email},
                data: {
                    favResidanciesiD: {
                        push: [rid]
                    }
                }
            })
            res.send({message: "Updated to favourites", user: updateUser})
        }

    } catch(err)
    {
        throw new Error(err.message)
    }
  })

  
  // 1 and 27 and 57
  //function to get all favourite
  export const getAllFavorites = asynchHandler (async(req,res)=>{
    const {email} = req.body;
    try{
        const favResd = await prisma.user.findUnique({
            where:{email},
            select: {favResidanciesiD: true}
        })
        res.status(200).send(favResd)
    }catch(err){
        throw new Error(err.message);
    }
  })
    
