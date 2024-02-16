"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const AddLookingSection = () => {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [sectionData, setSectionData] = useState({
        image: "",
        link_type: "category",
        categoryId: "",
        cityId: [],
    });
    const [locations, setLocations] = useState([]);
    const [file, setFile] = useState();

    const fetchCategories = async () => {
        try {
          const { data } = await axios.post("/api/category/fetch-categories");
          const fetchedCategories = data.categories;
          setCategories(fetchedCategories);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
    };

    const getLocations = async () => {
        try {
          const response = await axios.post("/api/location/fetch-locations");
          setLocations(response.data.locations);
           
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, options } = e.target;
        if(name=="cityId"){
            let selectedValues = [];
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    selectedValues.push(options[i].value);
                }
            }
            setSectionData(prevState => ({
                ...prevState,
                [name]: selectedValues
            }));
        }else if(name=="image"){
            const value = e.target.files[0].name;
            setSectionData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }else{
            setSectionData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    
    const handleSaveClick = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({}); // Reset errors object before validation
        // console.log(sectionData);
        // return;
        // Basic validation
        if (!file) {
            setErrors(prevErrors => ({
                ...prevErrors,
                image: "Image is required"
            }));
            setSubmitLoading(false);
            return;
        }

        if (sectionData.cityId.length === 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                cityId: "Please select at least one city"
            }));
            setSubmitLoading(false);
            return;
        }

        if (!sectionData.link_type) {
            setErrors(prevErrors => ({
                ...prevErrors,
                link_type: "Please select image link type"
            }));
            setSubmitLoading(false);
            return;
        }

        if (sectionData.link_type === "category" && !sectionData.categoryId) {
            setErrors(prevErrors => ({
                ...prevErrors,
                categoryId: "Please select a category"
            }));
            setSubmitLoading(false);
            return;
        }

        try{

            // first upload file
            const data = new FormData();
            data.set("file", file);
            const res = await fetch("/api/upload", {
              method: "POST",
              body: data,
            });
            const json = await res.json();
            if (json.success){
                var formData =  "";
                if(sectionData.link_type === "category"){
                    formData = {
                        image: json.location,
                        link_type : sectionData.link_type,
                        category_id : sectionData.categoryId,
                        cityIds : sectionData.cityId
                    };
                }else{
                    formData = {
                        image: json.location,
                        link_type : sectionData.link_type,
                        cityIds : sectionData.cityId
                    };
                }
                
                const response = await axios.post("/api/manage-layouts/add-looking-for-img", formData);
    
                if (response.data.success) {
                    toast.success(response.data.message, { autoClose: 3000 });
                    setTimeout(function(){
                        window.location.reload();
                    },1000)
                } else {
                    toast.error(response.data.message, { autoClose: 3000 });
                }
    
                setSectionData({
                    image: "",
                    link_type: "category",
                    categoryId: "",
                    cityId: [],
                });
            }else{
                throw new Error(await res.text())
            }


            

        }catch(error){
            console.log(error);
        }


        //    
       console.log("sectionData : " + JSON.stringify(sectionData));

       setSubmitLoading(false);
    };
    

    useEffect(() => {
        fetchCategories();
        getLocations();
    }, []);

    return (
        <div className="overflow-x-auto">
            <div className="col-span-full">
                <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">Image</label>
                <div className="mt-2 flex items-center gap-x-3">
                  <Input onChange={(e) => setFile(e.target.files?.[0])} type="file" name="file" id="image"  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                {errors.image && <span className="text-red-500">{errors.image}</span>}  
            </div>

            <div className="col-span-full">
                <label htmlFor="cityId" className="block text-sm font-medium leading-6 text-gray-900">City</label>
                <div className="mt-2 flex items-center gap-x-3">
                    <select multiple   
                        onChange={handleChange}
                        name="cityId"
                        id="cityId"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset  sm:max-w-xs sm:text-sm sm:leading-6">
                        {locations.map((location) => (
                            <option key={location._id} value={location._id}>
                                {location.city}
                            </option>
                        ))}
                    </select>
                </div>
                {errors.cityId && <span className="text-red-500">{errors.cityId}</span>}  
            </div>


            <div className="col-span-full">
                <label htmlFor="link_type" className="block text-sm font-medium leading-6 text-gray-900">Image Link</label>
                <div className="mt-2 flex items-center gap-x-3">
                    <select onChange={handleChange} name="link_type" id="link_type"  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset  sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="" disabled>Please select image link type</option>
                        <option value="category">Link to Category</option>
                        <option value="no_link">No Link</option>
                    </select>
                </div>
                {errors.link_type && <span className="text-red-500">{errors.link_type}</span>} 
            </div>
            
            {sectionData.link_type == "category" && 
                <div className="col-span-full">
                    <label htmlFor="categoryId" className="block text-sm font-medium leading-6 text-gray-900">Category</label>
                    <div className="mt-2 flex items-center gap-x-3">
                        <select
                        onChange={handleChange}
                        name="categoryId" id="categoryId" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset  sm:max-w-xs sm:text-sm sm:leading-6">
                            <option value="">Please select category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                        </select>
                    </div>
                    {errors.categoryId && <span className="text-red-500">{errors.categoryId}</span>} 
                </div>
            }
            

            <div className="col-span-full mt-4 text-center">
                {submitLoading ? <Button type="button">Please wait...</Button> : <Button  type="submit" onClick={handleSaveClick}>Add New Image</Button>  }
               
            </div>
            
        </div>
    )

}

export default AddLookingSection;