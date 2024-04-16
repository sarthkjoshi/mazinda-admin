"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import { useRouter, useSearchParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CentralDatabase() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState("blinkit");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const currentIndex = useSearchParams().get("ci") || 1;
  const [productDetailsJson, setProductDetailsJson] = useState({});
  const [jsonValid, setJsonValid] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const handleUpload = async () => {
    setLoading(true);
    let success = 0;
    let failed = 0;

    for (let i = 0; i < 3; i++) {
      const { productName, description, imagePaths } = products[i];
      try {
        const { data } = await axios.post(`/api/cdb/add-product`, {
          productName,
          description,
          imagePaths,
          category: selectedCategory,
          subcategory: selectedSubcategory,
        });
        if (data.success) {
          success++;
          toast.success(data.message);
        } else {
          failed++;
          toast.error(data.error);
        }
      } catch (error) {
        failed++;
        toast.error("Error adding product");
      }
    }
    setLoading(false);
    toast.info(`${success} products added successfully and ${failed} failed`);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-3xl my-2">Central Database</h1>
        <div>
          <Button
            onClick={async () => {
              if (currentIndex == 3) {
                await handleUpload();
              } else {
                router.push(`?ci=${parseInt(currentIndex) + 1}`);
              }
            }}
            disabled={
              (parseInt(currentIndex) === 1 &&
                (!selectedCategory || !selectedSubcategory)) ||
              (parseInt(currentIndex) === 2 && !jsonValid) ||
              (parseInt(currentIndex) === 3 && !products.length) ||
              loading
            }
          >
            {currentIndex == 3
              ? loading
                ? "Uploading ..."
                : "Upload to Central Database"
              : "Proceed"}
          </Button>
        </div>
      </div>
      {parseInt(currentIndex) === 1 ? (
        <Page1
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedSubcategory={setSelectedSubcategory}
        />
      ) : parseInt(currentIndex) === 2 ? (
        <Page2
          setProductDetailsJson={setProductDetailsJson}
          setJsonValid={setJsonValid}
        />
      ) : (
        <Page3
          products={products}
          setProducts={setProducts}
          productDetailsJson={productDetailsJson}
        />
      )}
    </div>
  );
}

const Page1 = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  selectedSubcategory,
  setSelectedCategory,
  setSelectedSubcategory,
}) => {
  let code = `
    from bs4 import BeautifulSoup
    from selenium import webdriver
    import time
    import json
    
    # Function to extract Product Title
    def get_title(soup):
        try:
            title_h1 = soup.find("h1", class_='ProductInfoCard__ProductName-sc-113r60q-10 dsuWXl')
            title = title_h1.text.strip()
        except AttributeError:
            title = ""
        return title
    
    # Function to extract Product Price
    def get_price(soup):
        try:
            price_div = soup.find("div", class_='ProductVariants__PriceContainer-sc-1unev4j-7 gGENtH')
            price = price_div.text.strip()
        except AttributeError:
            price = ""
        return price
    
    # Function to extract Product Images
    def get_images(soup):
        try:
            img_tags = soup.find_all("img", class_='ProductCarousel__CarouselImage-sc-11ow1fv-4')
            imgs = [img_tag.get('src') for img_tag in img_tags]
        except AttributeError:
            imgs = []
        return imgs
    
    # Function to extract Product Description
    def get_description(soup):
        try:
            h_containers = soup.find_all("p", class_='ProductAttribute__ProductAttributesName-sc-dyoysr-5 heSLbJ')
            d_containers = soup.find_all("div", class_='ProductAttribute__ProductAttributesDescription-sc-dyoysr-6 jJVAqC')
    
            data = [{'heading': h_container.find("span").text.strip(), 'description': d_container.text.strip()} 
                    for h_container, d_container in zip(h_containers, d_containers)]
        except AttributeError:
            data = []
        return data
    
    if __name__ == '__main__':
        search_query = '${searchQuery}'
    
        # Set up Selenium webdriver
        options = webdriver.FirefoxOptions()
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--incognito')
        options.add_argument('--headless')
        driver = webdriver.Firefox(options=options)
    
        # The webpage URL
        URL = f"https://blinkit.com/s/?q={search_query}"
    
        # Load the webpage
        driver.get(URL)
        time.sleep(5)  # Wait for the page to load
    
        # Simulate scrolling to the bottom of the page
        last_height = driver.execute_script("return document.body.scrollHeight")
        while True:
            print("scrolling...")
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)  # Wait for the page to load new content
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height
    
        print("scrolling done !")
        soup = BeautifulSoup(driver.page_source, "html.parser")
    
        product_a_tags = soup.find_all('a', attrs={'data-test-id': 'plp-product'})
        hrefs = [product_a_tag.get('href') for product_a_tag in product_a_tags]
    
        print(f"{len(hrefs)} products found")
    
        product_details = {"title": [], "price": [], "images": [], "description": []}
    
        i = 0
    
        # Loop for extracting product details from each link 
        for href in hrefs:
            new_url = "https://www.blinkit.com" + href
            driver.get(new_url)
            new_soup = BeautifulSoup(driver.page_source, "html.parser")
    
            product_details["title"].append(get_title(new_soup))
            product_details["price"].append(get_price(new_soup))
            product_details["images"].append(get_images(new_soup))
            product_details["description"].append(get_description(new_soup))
    
            i += 1
            print(f"{i} products fetched")
    
        driver.quit()  # Close the browser
        # print(product_details)
    
        # Save product_details as a JSON file
        with open('product_details.json', 'w') as json_file:
            json.dump(product_details, json_file)
        
    `;
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.post("/api/category/fetch-categories");
      console.log("dataaaaaaa", data);
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching stores: ", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="bg-white px-3 py-2 rounded-lg space-y-5">
      <div className="space-y-1">
        <Label>Choose service</Label>
        <RadioGroup defaultValue="blinkit">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blinkit" id="selected-service" />
            <Label htmlFor="selected-service">Blinkit</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="category-filter" className="font-bold">
            Choose Category
          </Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem
                  key={category.categoryName}
                  value={category.categoryName}
                >
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category-filter" className="font-bold">
            Choose Subcategory
          </Label>
          <Select
            value={selectedSubcategory}
            onValueChange={(value) => setSelectedSubcategory(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              {selectedCategory &&
                categories
                  ?.find(
                    (category) => category.categoryName === selectedCategory
                  )
                  ?.subcategories?.map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Enter search query</Label>
        <div className="flex items-center gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {searchQuery && (
        <div>
          <CopyBlock
            text={code}
            language={"python"}
            showLineNumbers={true}
            wrapLines
            wrapLongLines={true}
            theme={dracula}
          />
        </div>
      )}
    </div>
  );
};

const Page2 = ({ setProductDetailsJson, setJsonValid }) => {
  const [json, setJson] = useState("");
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(json);
      setProductDetailsJson(parsedJson);
      setJsonValid(true);
    } catch (error) {
      console.log("Invalid JSON");
      setJsonValid(false);
    }
  }, [json]);

  return (
    <>
      <Label>Paste the output here</Label>
      <Textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={100}
        className="max-h-screen"
      />
    </>
  );
};

const Page3 = ({ products, setProducts, productDetailsJson }) => {
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    if (Object.keys(productDetailsJson).length) {
      let newProducts = []; // Create a new array to store products
      for (let i = 0; i < productDetailsJson["title"].length; i++) {
        const filteredDescription = productDetailsJson["description"][i]
          .map((desc) => {
            if (desc.heading === "Disclaimer") {
              return {
                heading: "Disclaimer",
                description:
                  "We strive to ensure the accuracy of all information provided. However, please note that actual product packaging and materials may contain additional or differing information. It is advisable not to solely depend on the presented information.",
              };
            } else if (desc.heading === "Customer Care Details") {
              return {
                heading: "Customer Care Details",
                description: "+91 7876901177",
              };
            } else {
              const bannedHeadings = [
                "Manufacturer Details",
                "FSSAI License",
                "Return Policy",
                "Seller",
                "Seller FSSAI",
              ];
              if (!bannedHeadings.includes(desc.heading)) {
                return desc;
              }
            }
          })
          .filter(Boolean); // Remove any undefined or null values
        newProducts.push({
          productName: productDetailsJson["title"][i],
          imagePaths: productDetailsJson["images"][i],
          description: filteredDescription,
        });
      }
      setProducts(newProducts); // Set the new array as the state
    }
  }, [productDetailsJson]);

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = (index, updatedProduct) => {
    const updatedProducts = [...products];
    updatedProducts[index] = updatedProduct;
    setProducts(updatedProducts);
    setEditingIndex(-1);
  };
  console.log(products);
  return (
    <div>
      {!Object.keys(productDetailsJson).length && <span>Data not found</span>}
      {products.map((product, index) => (
        <div
          key={index}
          className="rounded-lg flex items-center gap-5 bg-white p-2 mb-2 border"
        >
          {editingIndex === index ? (
            <EditProduct
              product={product}
              onSave={(updatedProduct) => handleSave(index, updatedProduct)}
            />
          ) : (
            <>
              <img src={product.imagePaths[0]} className="h-16 w-16" />
              <span>{product.productName}</span>
              <Button onClick={() => handleEdit(index)}>Edit</Button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const EditProduct = ({ product, onSave }) => {
  const [productName, setProductName] = useState(product.productName);
  const [imagePaths, setImagePaths] = useState(product.imagePaths);
  const [description, setDescription] = useState(product.description);

  const handleImagePathRemove = (index) => {
    const updatedImagePaths = [...imagePaths];
    updatedImagePaths.splice(index, 1);
    setImagePaths(updatedImagePaths);
  };

  const handleDescriptionChange = (index, newHeading, newDesc) => {
    const updatedDescription = [...description];
    updatedDescription[index] = { heading: newHeading, description: newDesc };
    setDescription(updatedDescription);
  };

  const handleRemoveDescription = (index) => {
    const updatedDescription = [...description];
    updatedDescription.splice(index, 1);
    setDescription(updatedDescription);
  };

  const handleSave = () => {
    onSave({ productName, imagePaths, description });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-3">
        Name:
        <Input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div>
        <p>Iamges:</p>
        {imagePaths.map((path, index) => (
          <div key={index} className="flex items-center gap-2">
            <img src={path} className="h-16 w-16" />
            <Button onClick={() => handleImagePathRemove(index)}>Remove</Button>
          </div>
        ))}
      </div>
      <div>
        <p>Descriptions:</p>
        {description.map((desc, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border p-3 rounded-lg mb-2"
          >
            Heading
            <Input
              value={desc.heading}
              onChange={(e) =>
                handleDescriptionChange(index, e.target.value, desc.description)
              }
            />
            Description
            <Textarea
              value={desc.description}
              onChange={(e) =>
                handleDescriptionChange(index, desc.heading, e.target.value)
              }
            />
            <Button onClick={() => handleRemoveDescription(index)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};
