import Car from "../models/Car.model.js";
import { addImage } from "./ImagesController.js";
import { addLocation } from "./LocationController.js";
import { addCarDetails } from "./CarDetailsController.js";
import { addFeatures } from "./FeaturesController.js";
import {addCarToBought} from "./userDetailsController.js";
import Features from "../models/Features.model.js"; 
import CarDetails from "../models/CarDetails.model.js";
import Images from "../models/Images.model.js";
import Location from "../models/Location.model.js";
export const createCar = async (req, res) => {
  try {
    const { userId, make, model, price, status, regno, images, location, carDetails, features } = req.body;

    const newCar = new Car({ userId, make, model, price, status, regno});
    const savedCar = await newCar.save();

    const carId = savedCar._id;

    if (images && images.length > 0) {
      for (const img of images) {
        await addImage({ body: { ...img, carId } }, { status: () => ({ json: () => {} }) });
      }
    }

    if (location) {
      await addLocation({ body: { ...location, carId } }, { status: () => ({ json: () => {} }) });
    }

    if (carDetails) {
      await addCarDetails({ body: { ...carDetails, carId } }, { status: () => ({ json: () => {} }) });
    }

    if (features) {
        await addFeatures({ body: { ...features, carId } }, { status: () => ({ json: () => {} }) });
    }
    
    res.status(201).json({ message: "Car and related details created successfully", car: savedCar });
  } catch (error) {
    res.status(500).json({ message: "Error creating car", error: error.message });
  }
};


export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();

    const carRecords = await Promise.all(
      cars.map(async (car) => {
        const features = await Features.findOne({ carId: car._id });
        const carDetails = await CarDetails.findOne({ carId: car._id });
        const images = await Images.find({ carId: car._id });
        const location = await Location.findOne({ carId: car._id });

        return {
          carId: car._id, 
          userId: car.userId,
          status: car.status,
          make: car.make,
          model: car.model,
          price: car.price,
          regno: car.regno,

          images: images.map((img) => ({ imageURL: img.imageURL })),

          features: features
            ? {
                engine: features.engine,
                mileage: features.mileage,
                fuelType: features.fuelType,
                transmission: features.transmission,
                seatingCapacity: features.seatingCapacity,
                bodyType: features.bodyType,
                color: features.color,
                yearOfManufacture: features.yearOfManufacture,
                driveType: features.driveType,
              }
            : null,

          carDetails: carDetails
            ? {
                age: carDetails.age,
                distanceTravelled: carDetails.distanceTravelled,
                numberOfOwners: carDetails.numberOfOwners,
              }
            : null,

          location: location
            ? {
                country: location.country,
                state: location.state,
                city: location.city,
              }
            : null,
        };
      })
    );

    res.status(200).json(carRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id });
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.status(200).json({ message: "Car and related records deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCarsByUserId = async (req , res) => {
  try{
    const cars = await Car.find({userId : req.params.userId});
    if(!cars) return res.status(404).json({message : "No cars found for the user"});
        const carRecords = await Promise.all(
      cars.map(async (car) => {
        const features = await Features.findOne({ carId: car._id });
        const carDetails = await CarDetails.findOne({ carId: car._id });
        const images = await Images.find({ carId: car._id });
        const location = await Location.findOne({ carId: car._id });

        return {
          carId: car._id, 
          userId: car.userId,
          status: car.status,
          make: car.make,
          model: car.model,
          price: car.price,
          regno: car.regno,

          images: images.map((img) => ({ imageURL: img.imageURL })),

          features: features
            ? {
                engine: features.engine,
                mileage: features.mileage,
                fuelType: features.fuelType,
                transmission: features.transmission,
                seatingCapacity: features.seatingCapacity,
                bodyType: features.bodyType,
                color: features.color,
                yearOfManufacture: features.yearOfManufacture,
                driveType: features.driveType,
              }
            : null,

          carDetails: carDetails
            ? {
                age: carDetails.age,
                distanceTravelled: carDetails.distanceTravelled,
                numberOfOwners: carDetails.numberOfOwners,
              }
            : null,

          location: location
            ? {
                country: location.country,
                state: location.state,
                city: location.city,
              }
            : null,
        };
      })
    );

    res.status(200).json(carRecords);
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
}