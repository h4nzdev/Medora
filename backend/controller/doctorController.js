import Doctor from "../model/doctorModel.js";

// ➤ Add new doctor
export const addDoctor = async (req, res) => {
  try {
    const {
      clinicId,
      name,
      gender,
      qualification,
      specialty,
      experience,
      email,
      phone,
      status,
      availability,
    } = req.body;

    // Parse availability if it's a string (from FormData)
    let availabilityData = availability;
    if (typeof availability === "string") {
      try {
        availabilityData = JSON.parse(availability);
      } catch (err) {
        return res.status(400).json({ message: "Invalid availability format" });
      }
    }

    let profileImage = "";
    if (req.file) {
      profileImage = req.file.path;
    }

    const doctor = new Doctor({
      clinicId,
      name,
      gender,
      qualification,
      specialty,
      experience,
      email,
      phone,
      profileImage,
      status: status || "Active",
      availability: availabilityData, // <-- now it's an array
    });

    await doctor.save();
    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding doctor", error: error.message });
  }
};

// ➤ Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("clinicId", "name email");
    res.json(doctors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching doctors", error: error.message });
  }
};

// ➤ Get single doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "clinicId",
      "name email"
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching doctor", error: error.message });
  }
};

// ➤ Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const {
      name,
      gender,
      qualification,
      specialty,
      experience,
      email,
      phone,
      status,
      availability,
    } = req.body;

    // Parse availability if it's a string (from FormData)
    let availabilityData = availability;
    if (typeof availability === "string") {
      try {
        availabilityData = JSON.parse(availability);
      } catch (parseError) {
        console.error("Error parsing availability:", parseError);
        availabilityData = [];
      }
    }

    const updateData = {
      name,
      gender,
      qualification,
      specialty,
      experience: parseInt(experience) || 0,
      email,
      phone,
      status,
      availability: availabilityData, // Use the parsed data
    };

    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("clinicId", "name email");

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Doctor updated successfully", doctor });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res
      .status(500)
      .json({ message: "Error updating doctor", error: error.message });
  }
};

// ➤ Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting doctor", error: error.message });
  }
};

// ➤ Get doctors by clinicId
export const getDoctorsByClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const doctors = await Doctor.find({ clinicId }).populate(
      "clinicId",
      "name email"
    );

    if (!doctors || doctors.length === 0) {
      return res
        .status(404)
        .json({ message: "No doctors found for this clinic" });
    }

    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching doctors by clinicId",
      error: error.message,
    });
  }
};
