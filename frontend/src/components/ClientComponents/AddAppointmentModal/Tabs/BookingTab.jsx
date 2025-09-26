'use client';

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const BookingTab = ({ formData, setFormData, prevTab, nextTab }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Booking Type</h3>
        <p className="text-slate-500 text-sm mt-1">
          Choose how you'd like to have your appointment.
        </p>
      </div>

      <RadioGroup
        value={formData.bookingType}
        onValueChange={(value) => setFormData({ ...formData, bookingType: value })}
        className="space-y-4"
      >
        <Label
          htmlFor="online"
          className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${formData.bookingType === "online" ? "border-cyan-500 bg-cyan-50" : "border-slate-200 hover:border-slate-300"}`}>
          <RadioGroupItem value="online" id="online" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">Online Consultation</span>
            <span className="text-sm text-slate-500">Meet with your doctor virtually.</span>
          </div>
        </Label>

        <Label
          htmlFor="walk-in"
          className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${formData.bookingType === "walk-in" ? "border-cyan-500 bg-cyan-50" : "border-slate-200 hover:border-slate-300"}`}>
          <RadioGroupItem value="walk-in" id="walk-in" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">Walk-In</span>
            <span className="text-sm text-slate-500">Visit the clinic in person.</span>
          </div>
        </Label>
      </RadioGroup>
      <div className="flex justify-between pt-4">
        <button type="button" onClick={prevTab} className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium">
          Back
        </button>
        <button type="button" onClick={nextTab} className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all duration-200 font-medium" disabled={!formData.bookingType}>
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingTab;