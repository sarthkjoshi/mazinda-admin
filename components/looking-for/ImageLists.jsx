"use client";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { TableFooter } from "@mui/material";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import AddLookingSection from "./AddImage";
import { toast } from "react-toastify";
const LookingSectionLists = () => {
 
  const [newSection, setNewSection] = useState(false)
  const [loading_data, setLoading_Data] = useState(true)
  const [sections, setSections] = useState([]);
  const [cities, setCities] = useState([]);
  const [deletingState, setDeletingState] = useState({});
 

  const getSections = async (locations) => {
    try {
      
      const response = await axios.post("/api/manage-layouts/fetch-looking-for");
      if (response.data.sections) {
        const sections = response.data.sections;
        // Map cityIds to location names for each section
        const updatedSections = sections.map((section) => ({
          ...section,
          cityNames: section.cityIds.map((cityId) => {
            const newlocation = locations.find((location) => location._id === cityId);
            return newlocation ? newlocation.city : "";
          }),
        }));
        
        setSections(updatedSections);
        setLoading_Data(false)
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };


  const getFilename = async (s3Url) => {
    // const s3Url = "https://mazindabucket.s3.amazonaws.com/2024-02-16T095518042Z_electronics.png";
    const url = new URL(s3Url);
    const pathSegments = url.pathname.split('/');
    const filename = pathSegments[pathSegments.length - 1];
    return filename
  }

  const handleDelete = async (sectionId, imageUrl) => {
    setDeletingState((prevDeletingState) => ({
      ...prevDeletingState,
      [sectionId]: true,
    }));

    try {
      await deleteSection(sectionId, imageUrl);
    } finally {
      setDeletingState((prevDeletingState) => ({
        ...prevDeletingState,
        [sectionId]: false,
      }));
    }
  };

  const deleteSection = async (section_id,image_url) => {
  
    const { data } = await axios.put("/api/manage-layouts/delete-looking-for-img", { section_id });
    if (data.success) {
      if(image_url){
        
        var fileName = await getFilename(image_url);
        const deleteResponse = await fetch("/api/upload/delete-image", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName: fileName }),
        });
    
        const deleteJson = await deleteResponse.json();

        if (deleteJson.success) {
          console.log("File deleted successfully:", deleteJson);
        } else {
          console.error("Error deleting file:", deleteJson.error);
        }

      }
      toast.success("Section deleted successfully");
      fetchLocationsAndSections();
    } else {
      toast.error("Error deleting the section");
    }
  }

  const fetchLocationsAndSections = async () => {
    try {
        const response = await axios.post("/api/location/fetch-locations");
        const locations = response.data.locations;
        setCities(locations);
        await getSections(locations); // Call getSections after cities are fetched
    } catch (error) {
        console.error("Error fetching locations:", error);
    }
  };
  useEffect(() => {
   
    fetchLocationsAndSections();

  }, []);

  return (
   
    <div className="flex flex-col items-center gap-2">
        <div className="overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Link To</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Options</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {sections.map((section) => (
              <TableRow key={section._id}>
                <TableCell>{section._id.slice(-5)}</TableCell>
                <TableCell><img src={section.image} width="100" alt="Section Image" /></TableCell>
                <TableCell>{section.link_type=='category' ? section.category_id.categoryName : 'No Link'}</TableCell>
                <TableCell>{section.cityNames.join(", ")}</TableCell>
                <TableCell>
                    {/* <Button onClick={()=>deleteSection(section._id,section.image)} className="mr-3 bg-red-500">Delete</Button> */}
                    <Button
                      onClick={() => handleDelete(section._id, section.image)}
                      className="mr-3 bg-red-500"
                      disabled={deletingState[section._id]}
                    >
                      {deletingState[section._id] ? 'Please wait...' : 'Delete'}
                    </Button>
                    {/* <Button>Edit</Button> */}
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
            <TableFooter>
                <TableCell className="right-0">
                    <Button onClick={()=> setNewSection((newSection)=> !newSection) } className="bg-yellow-500 px-3 py-1 text-white rounded-md">{ !newSection ? "Add New" : "Cancel"}</Button>
                </TableCell>
            </TableFooter>
            </Table>
        </div>

        {newSection && <AddLookingSection/>}
        
    </div>
  );
};

export default LookingSectionLists;
