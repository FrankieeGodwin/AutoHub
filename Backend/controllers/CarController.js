import Car from "../models/Car.model.js";
import { addImage } from "./ImagesController.js";
import { addLocation } from "./LocationController.js";
import { addCarDetails } from "./CarDetailsController.js";
import { addFeatures } from "./FeaturesController.js";
import {addCarToBought} from "./userDetailsController.js"; 
export const createCar = async (req, res) => {
  try {
    const { userId, make, model, price, status, images, location, carDetails, features } = req.body;

    const newCar = new Car({ userId, make, model, price, status });
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
    res.status(200).json(cars);
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
