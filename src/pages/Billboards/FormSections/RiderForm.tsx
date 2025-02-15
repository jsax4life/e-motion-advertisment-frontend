import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormInput, FormSelect, FormLabel } from "../../../base-components/Form";
import TomSelect from "../../../base-components/TomSelect";

interface RiderDetailsFormProps {
  lagosLGAs: string[];
}

const RiderDetailsForm: React.FC<RiderDetailsFormProps> = ({ lagosLGAs }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (

    <div className="mt-5 intro-y text-slate-600">
    <div className="flex items-center py-4 text-primary">
      <h3 className="intro-y box  font-semibold mr-4 text-sm ">
        RIDER DETAILS
      </h3>
      <hr className="flex-grow border-t border-primary/50" />
    </div>

    <div className="py-5 ">
      <div className="grid grid-cols-12 gap-x-5">
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <div>
            <FormLabel htmlFor="first_name">
              First Name
            </FormLabel>

            <div className="intro-y">
              <FormInput
                id="first_name"
                type="text"
                placeholder="First Name"
                // value={rider?.first_name}
                {...register("first_name")}
                className=""
              />
              {errors.first_name && (
                <p className="text-red-500">
                  {errors.first_name.message?.toString()}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3">
            <FormLabel htmlFor="update-profile-form-7">
              Age
            </FormLabel>

            <FormInput
              id="age"
              type="number"
              placeholder="Age"
              {...register("age")}
              className=""
            //   value={rider?.age}
            />
            {errors.age && (
              <p className="text-red-500">
                {errors.age.message?.toString()}
              </p>
            )}
          </div>
          <div className="mt-3">
            <FormLabel htmlFor="update-profile-form-12">
              LGA
            </FormLabel>
            {/* <TomSelect
              id="update-profile-form-12"
         
              className="w-full"
            >
              <option value="" disabled>
                --Select LGA--
              </option>
              {lagosLGAs.map((lga, index) => (
                <option key={index} value={lga}>
                  {lga}
                </option>
              ))}
            </TomSelect> */}
            {/* tom here */}
            <Controller
              control={control}
              name="lga"
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full"
                  {...lagosLGAs.map((lga, index) => (
                    <option key={index} value={lga}>
                      {lga}
                    </option>
                  ))}
                //   options={lagosLGAs.map((lga) => ({
                //     value: lga,
                //     label: lga,
                //   }))}
                />
              )}
            />
          </div>

          <div className="mt-3">
            <FormLabel htmlFor="tribe">Tribe</FormLabel>
            {/* ttom here */}
            <select
              id="tribe"
            //   onChange={setSelect}
              className="w-full"
            >
              <option value="" disabled>
                --Tribe--
              </option>
              <option value="Yoruba">Yoruba</option>
              <option value="Hausa">Hausa</option>
              <option value="Igbo">Igbo</option>
              <option value="⁠Awori">⁠Awori</option>
              <option value="⁠Ijebu">⁠Ijebu</option>
              <option value="⁠Egun">⁠Egun</option>
              <option value="⁠Nupe">⁠Nupe</option>
              <option value="⁠Fulani">⁠Fulani</option>
              <option value="⁠Others">⁠Others</option>
            </select>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <div className="mt-3 xl:mt-0">
            <FormLabel htmlFor="middle_name">
              Middle Name
            </FormLabel>

            <FormInput
              id="middle_name"
              type="text"
              placeholder="Middle Name"
              {...register("middle_name")}
              className=""
            />
            {errors.middle_name && (
              <p className="text-red-500">
                {errors.middle_name.message?.toString()}
              </p>
            )}
          </div>
          <div className="mt-3">
            <div className="mt-3">
              <FormLabel htmlFor="phone">
                Phone Number
              </FormLabel>

              <FormInput
                id="phone"
                type="number"
                placeholder="0807********"
                {...register("phone")}
                className=""
                maxLength={11}
              />
              {errors.phone && (
                <p className="text-red-500">
                  {errors.phone.message?.toString()}
                </p>
              )}
            </div>

            <div className="mt-3">
              <FormLabel
                htmlFor="update-profile-form-8"
               
                
              >
                Park/Zone
              </FormLabel>
              <FormSelect
                id="parkzone"
                {...register("parkzone")}
              >
                <option value="" disabled>
                  --Park Zone--
                </option>
                <option value="zone1">Zone1</option>
                <option value="zone2">Zone2</option>
              </FormSelect>

              {errors.parkzone && (
                <p className="text-red-500">
                  {errors.parkzone.message?.toString()}
                </p>
              )}
            </div>
            <div className="mt-3">
              <FormLabel htmlFor="home_address">
                Address
              </FormLabel>
              <FormInput
                {...register("home_address")}
                id="home_address"
                type="text"
                placeholder="Input text"
                // value="10 Anson Road, International Plaza, #10-11, 079903 Singapore, Singapore"
                onChange={() => {}}
              />
              {errors.home_address && (
                <p className="text-red-500">
                  {errors.home_address.message?.toString()}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <div className="mt-3 xl:mt-0">
            <FormLabel htmlFor="update-profile-form-10">
              Last Name
            </FormLabel>

            <FormInput
              id="last_name"
              type="text"
              placeholder="Last Name"
              {...register("last_name")}
              className=""
            />
            {errors.last_name && (
              <p className="text-red-500">
                {errors.last_name.message?.toString()}
              </p>
            )}
          </div>

          <div className="mt-3">
            <FormLabel
              htmlFor="update-profile-form-8"
             
            >
              Gender
            </FormLabel>
            <FormSelect id="update-profile-form-8"
             {...register("gender")}
             className=""
            //  value={vehicleDetails?.rider?.gender || ""}
            //  onChange={(e) => setValue("gender", e.target.value, { shouldValidate: true })}
            >
              <option value="" disabled>
                --Gender--
              </option>
              <option value="m">Male</option>
              <option value="f">Female</option>
            </FormSelect>

            {errors.gender && (
              <p className="text-red-500">
                {errors.gender.message?.toString()}
              </p>
            )}
          </div>

          <div className="mt-3">
            <FormLabel htmlFor="gender">Religion</FormLabel>
            <FormSelect id="religion" {...register("religion")}>
              <option value="" disabled>
                --Religon--
              </option>
              <option value="christian">Christian</option>
              <option value="islam">Islam</option>
              <option value="traditonal">Traditonal</option>
              <option value="none">None</option>
            </FormSelect>

            {errors.parkzone && (
              <p className="text-red-500">
                {errors.parkzone.message?.toString()}
              </p>
            )}
          </div>
     
        </div>
      </div>
    </div>
  </div>



    // <div className="py-5">
    //   <div className="grid grid-cols-12 gap-x-5">
    //     <div className="col-span-12 md:col-span-6 lg:col-span-4">
    //       <div>
    //         <FormLabel htmlFor="first_name">First Name</FormLabel>
    //         <div className="intro-y">
    //           <FormInput
    //             id="first_name"
    //             type="text"
    //             placeholder="First Name"
    //             {...register("first_name")}
    //             className=""
    //           />
    //           {errors.first_name && (
    //             <p className="text-red-500">
    //               {errors.first_name.message?.toString()}
    //             </p>
    //           )}
    //         </div>
    //       </div>
    //       <div className="mt-3">
    //         <FormLabel htmlFor="age">Age</FormLabel>
    //         <FormInput
    //           id="age"
    //           type="number"
    //           placeholder="Age"
    //           {...register("age")}
    //           className=""
    //         />
    //         {errors.age && (
    //           <p className="text-red-500">{errors.age.message?.toString()}</p>
    //         )}
    //       </div>
    //       <div className="mt-3">
    //         <FormLabel htmlFor="update-profile-form-12">LGA</FormLabel>
    //         <Controller
    //           control={control}
    //           name="lga"
    //           render={({ field }) => (
    //             <TomSelect
    //               {...field}
    //               className="w-full"
    //               options={lagosLGAs.map((lga) => ({
    //                 value: lga,
    //                 label: lga,
    //               }))}
    //             />
    //           )}
    //         />
    //         {errors.lga && (
    //           <p className="text-red-500">{errors.lga.message?.toString()}</p>
    //         )}
    //       </div>
    //       <div className="mt-3">
    //         <FormLabel htmlFor="religion">Religion</FormLabel>
    //         <FormInput
    //           id="religion"
    //           type="text"
    //           placeholder="Religion"
    //           {...register("religion")}
    //           className=""
    //         />
    //         {errors.religion && (
    //           <p className="text-red-500">
    //             {errors.religion.message?.toString()}
    //           </p>
    //         )}
    //       </div>
    //     </div>

    //     <div className="col-span-12 md:col-span-6 lg:col-span-4">
    //       <div className="mt-3">
    //         <FormLabel htmlFor="middle_name">Middle Name</FormLabel>
    //         <FormInput
    //           id="middle_name"
    //           type="text"
    //           placeholder="Middle Name"
    //           {...register("middle_name")}
    //           className=""
    //         />
    //       </div>
    //       <div className="mt-3">
    //         <FormLabel htmlFor="phone">Phone Number</FormLabel>
    //         <FormInput
    //           id="phone"
    //           type="text"
    //           placeholder="Phone Number"
    //           {...register("phone")}
    //           className=""
    //         />
    //         {errors.phone && (
    //           <p className="text-red-500">{errors.phone.message?.toString()}</p>
    //         )}
    //       </div>
    //       <div className="mt-3">
    //         <FormLabel htmlFor="tribe">Tribe</FormLabel>
    //         <FormInput
    //           id="tribe"
    //           type="text"
    //           placeholder="Tribe"
    //           {...register("tribe")}
    //           className=""
    //         />
    //         {errors.tribe && (
    //           <p className="text-red-500">{errors.tribe.message?.toString()}</p>
    //         )}
    //       </div>
    //       <div className="mt-3">
    //         <FormLabel htmlFor="parkzone">Parkzone</FormLabel>
    //         <FormInput
    //           id="parkzone"
    //           type="text"
    //           placeholder="Parkzone"
    //           {...register("parkzone")}
    //           className=""
    //         />
    //         {errors.parkzone && (
    //           <p className="text-red-500">
    //             {errors.parkzone.message?.toString()}
    //           </p>
    //         )}
    //       </div>
    //     </div>

    //     <div className="col-span-12 md:col-span-6 lg:col-span-4">
    //       <div className="mt-3">
    //         <FormLabel htmlFor="last_name">Last Name</FormLabel>
    //         <FormInput
    //           id="last_name"
    //           type="text"
    //           placeholder="Last Name"
    //           {...register("last_name")}
    //           className=""
    //         />
    //         {errors.last_name && (
    //           <p className="text-red-500">
    //             {errors.last_name.message?.toString()}
    //           </p>
    //         )}
    //       </div>
    //       <div className="mt-3">
    //         <FormLabel htmlFor="home_address">Home Address</FormLabel>
    //         <FormInput
    //           id="home_address"
    //           type="text"
    //           placeholder="Home Address"
    //           {...register("home_address")}
    //           className=""
    //         />
    //         {errors.home_address && (
    //           <p className="text-red-500">
    //             {errors.home_address.message?.toString()}
    //           </p>
    //         )}
    //       </div>
    //       <div className="mt-3">
    //         <FormLabel htmlFor="gender">Gender</FormLabel>
    //         <FormSelect
    //           id="gender"
    //           {...register("gender")}
    //           className=""
    //         >
    //           <option value="">Select Gender</option>
    //           <option value="male">Male</option>
    //           <option value="female">Female</option>
    //           <option value="other">Other</option>
    //         </FormSelect>
    //         {errors.gender && (
    //           <p className="text-red-500">{errors.gender.message?.toString()}</p>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default RiderDetailsForm;
