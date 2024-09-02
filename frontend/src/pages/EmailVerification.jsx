import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const EmailVerification = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { error, isLoading, verifyEmail } = useAuthStore();

    const handleChange = (index, value) => {
        const newCode = [...code];

        // Allow only numeric input
        if (/^\d$/.test(value)) {
            newCode[index] = value;
            setCode(newCode);

            // Move focus to the next input field if value is entered
            if (index < 5) {
                inputRefs.current[index + 1].focus();
            }
        } else if (value.length > 1) {
            // Handle pasted input case (accepts only the first 6 digits)
            const pastedCode = value.replace(/\D/g, "").slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);
            //Focus on the last non-empty input or the first empty one
            //ensures that the focus automatically moves to the next available input field as the user enters data
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            //By capping the 'focusIndex' at '5', the code prevents the focus from moving beyond the last input field
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex].focus();
        } else {
            newCode[index] = value;
            setCode(newCode);

            // Moe focus to the next input field if value is entered
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        //If a user presses "Backspace" in an empty input field, it automatically moves the focus to the previous input field, allowing the user to delete the previous character more easily
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join(""); //convert array to string
        try {
            await verifyEmail(verificationCode);
            navigate("/");
            toast.success("Email verified successfully");
        } catch (error) {
            console.log(error);
        }
    }

    // Auto submit when all fields are filled
    useEffect(() => {
        if (code.every(digit => digit !== '')) {
            handleSubmit({ preventDefault: () => { } });
        }
    }, [code]);

    return (
        <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md p-8 w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Verify Your Email
                </h2>
                <p className="text-center text-gray-300 mb-6">Enter the 6-digit code sent to your email address.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between">
                        {/* 
                            maps over the code array, creating an input field for each element (digit) in the array. 
                            digit: Represents the current value in the code array at the specific index.
                            index: Represents the position of the current digit in the array
                        */}
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                //The 'ref' prop is used to store a reference to each input element in the 'inputRefs' array. This allows for direct manipulation or focus management of specific input fields later.
                                //'inputRefs.current[index] = el' stores the reference to the DOM element at the corresponding index in the inputRefs.current array.
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={6} // max 6 no.s can be entered
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                //The 'onKeyDown' handler is triggered whenever a key is pressed while the input is focused
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

                    <motion.button
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg 
                        hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading || code.some((digit) => !digit)}
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}

export default EmailVerification