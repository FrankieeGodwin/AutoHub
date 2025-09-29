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
          type: car.type,
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
          type: car.type,
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
export const getRecommendedCars = async (req, res) => {
  try {
    const { carId } = req.params;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ msg: "Car not found" });

    // Looser matching: same make OR same model OR similar price
    const cars = await Car.find({
  _id: { $ne: carId },
  $and: [
    { $or: [{ make: car.make }, { model: car.model }] },
    { $or: [
        { color: car.color },
        { engine: car.engine },
        { price: { $gte: car.price * 0.8, $lte: car.price * 1.5 } }
    ]},
  ]
}).limit(5);


    const recommendedRecords = await Promise.all(
      cars.map(async (c) => {
        const features = await Features.findOne({ carId: c._id });
        const carDetails = await CarDetails.findOne({ carId: c._id });
        const images = await Images.find({ carId: c._id });
        const location = await Location.findOne({ carId: c._id });

        return {
          carId: c._id,
          userId: c.userId,
          status: c.status,
          make: c.make,
          model: c.model,
          price: c.price,
          type: c.type,
          regno: c.regno,
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

    res.status(200).json(recommendedRecords);
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    res.status(500).json({ msg: "Error fetching recommendations", error: err.message });
  }
};


export const getCarFAQs = async (req, res) => {
  try {
    const { carId } = req.params;
    if (!carId) {
      return res.status(400).json({ message: "Car ID is required" });
    }

    // Fetch the car and related collections
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const features = await Features.findOne({ carId: car._id });
    const carDetails = await CarDetails.findOne({ carId: car._id });
    const images = await Images.find({ carId: car._id });
    const location = await Location.findOne({ carId: car._id });

    // Generate FAQs dynamically
    const faqs = [];

    // Q1 - Long drive suitability
    if (carDetails?.distanceTravelled < 50000 && carDetails?.age < 5) {
      faqs.push({
        q: `Is the ${car.make} ${car.model} good for long drives?`,
        a: `Yes, with only ${carDetails.distanceTravelled} kms driven and a ${features?.fuelType} engine, this ${car.model} is reliable for long trips.`,
      });
    } else {
      faqs.push({
        q: `Is the ${car.make} ${car.model} suitable for long drives?`,
        a: `This ${car.model} has ${carDetails?.distanceTravelled || "many"} kms and is ${carDetails?.age || "several"} years old, so it’s better for city drives.`,
      });
    }

    // Q2 - Maintenance cost
    if (features?.transmission === "Automatic") {
      faqs.push({
        q: `Does the automatic ${car.model} require high maintenance?`,
        a: `Automatic cars like this ${car.model} may require slightly higher service costs than manuals, but provide excellent driving comfort.`,
      });
    } else {
      faqs.push({
        q: `Is the manual ${car.model} expensive to maintain?`,
        a: `Manual cars like this ${car.model} generally have lower servicing costs and simpler repairs compared to automatics.`,
      });
    }

    // Q3 - Mileage
    faqs.push({
      q: `What is the mileage of the ${car.model}?`,
      a: `This ${features?.fuelType} ${car.model} delivers an average mileage of ${features?.mileage || "N/A"} km/l, based on driving conditions.`,
    });

    // Q4 - Fuel type
    faqs.push({
      q: `Is the ${car.model} fuel efficient?`,
      a: `The ${car.model} runs on ${features?.fuelType}, making it ideal for ${features?.fuelType === "Diesel" ? "long distance drives" : "city commutes"}.`,
    });

    // Q5 - Seating
    if (features?.seatingCapacity >= 6) {
      faqs.push({
        q: `Is the ${car.model} suitable for families?`,
        a: `Yes, with ${features.seatingCapacity} seats, it’s spacious and ideal for family use.`,
      });
    } else {
      faqs.push({
        q: `Is the ${car.model} suitable for small families?`,
        a: `With ${features?.seatingCapacity || "N/A"} seats, it comfortably fits a small family.`,
      });
    }

    // Q6 - Age
    faqs.push({
      q: `How old is this ${car.model}?`,
      a: `This ${car.model} is ${carDetails?.age || "N/A"} years old, manufactured in ${features?.yearOfManufacture || "N/A"}.`,
    });

    // Q7 - Owners
    faqs.push({
      q: `How many owners has this ${car.model} had?`,
      a: `This car has had ${carDetails?.numberOfOwners || "N/A"} previous owner(s).`,
    });

    // Q8 - Price value
    faqs.push({
      q: `Is ₹${car.price.toLocaleString()} a fair price for the ${car.model}?`,
      a: `Considering it’s a ${features?.yearOfManufacture} model with ${carDetails?.distanceTravelled} kms driven, the price is competitive.`,
    });

    // Q9 - Body type suitability
    faqs.push({
      q: `Is the ${car.model} a good choice as a ${features?.bodyType}?`,
      a: `Yes, its ${features?.bodyType} design offers ${features?.bodyType === "SUV" ? "better ground clearance and space" : "compact comfort for city driving"}.`,
    });

    // Q10 - Location
    faqs.push({
      q: `Where is this ${car.model} available?`,
      a: `This car is available in ${location?.city}, ${location?.state}, ${location?.country}.`,
    });

    // Q11 - Performance (engine)
    faqs.push({
      q: `What kind of performance does the ${car.model} offer?`,
      a: `The ${car.model} is powered by a ${features?.engine || "N/A"} engine, delivering balanced performance for its class.`,
    });

    // Q12 - Resale value
    faqs.push({
      q: `Does the ${car.model} have good resale value?`,
      a: `Cars like the ${car.model} are known to retain value well, especially when maintained properly.`,
    });

    // Randomize order to avoid static feel
    const shuffledFAQs = faqs.sort(() => 0.5 - Math.random());

    res.status(200).json({ carId: car._id, faqs: shuffledFAQs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
