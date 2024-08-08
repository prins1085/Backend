import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Token")
    }
}

// const registerUser = asyncHandler(async (req, res) => {
//     const { username, email, fullName, password } = req.body;
//     const profileImage = req.file?.path;

//     // Validate required fields
//     if ([username, email, fullName, password].some((field) => field?.trim() === "")) {
//         throw new ApiError(400, "All Fields are required");
//     }

//     // Check if user already exists
//     const existedUser = await User.findOne({ email });
//     if (existedUser) {
//         throw new ApiError(401, "User already exists");
//     }

//     // Ensure profile image is provided
//     if (!profileImage) {
//         throw new ApiError(400, "Profile Image Required");
//     }

//     // Upload profile image to Cloudinary
//     let profileImagePath;
//     try {
//         profileImagePath = await uploadOnCloudinary(profileImage);
//     } catch (error) {
//         throw new ApiError(500, "Failed to upload profile image");
//     }

//     // Create new user
//     const user = await User.create({
//         username,
//         email,
//         fullName,
//         password,
//         profileImage: profileImagePath.url,
//     });

//     // Retrieve the created user without sensitive information
//     const createdUser = await User.findById(user._id).select("-password -refreshToken");
//     if (!createdUser) {
//         throw new ApiError(500, "Something Went Wrong while registering user");
//     }

//     return res.status(201).json(
//         new ApiResponse(200, createdUser, "User Registered Successfully!")
//     );
// });

const registerUser = asyncHandler(async (req, res) => {
    const { email, fullName, password } = req.body;

    // Validate required fields
    if ([email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(401, "User already exists");
    }

    // Create new user
    const user = await User.create({
        email,
        fullName,
        password,
    });

    // Retrieve the created user without sensitive information
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something Went Wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully!")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    console.log("called login handler");
    const { email, password } = req.body

    if (!email && !password) {
        throw new ApiError(400, "Email and Password Required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(401, "User not Found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Credencials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password, -refreshToken")

    const options = {
        httpOnly: true,
        secure: false
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(201, loggedInUser, "User logged In successfully")
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logout Successfully"))
})

export { registerUser, loginUser, logoutUser }
