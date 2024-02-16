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

  const deleteSection = async (section_id) => {
    const { data } = await axios.put("/api/manage-layouts/delete-looking-for-img", { section_id });
    if (data.success) {
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
                <TableCell>{section.image}</TableCell>
                <TableCell>{section.link_type=='category' ? section.category_id.categoryName : 'No Link'}</TableCell>
                <TableCell>{section.cityNames.join(", ")}</TableCell>
                <TableCell>
                    <Button onClick={()=>deleteSection(section._id)} className="mr-3 bg-red-500">Delete</Button>
                    <Button>Edit</Button>
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
