'use client';
import { useEffect, useState } from 'react';
import './FiestPage.css';
import Image from 'next/image';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase-auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from '../ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import Markdown from 'react-markdown';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export function FirstPage() {
  const [ showModal,setShowModal] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetchInventory();
    fetchRecipes();
  }, []);

  const fetchInventory = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventory(items);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const fetchRecipes = async () => {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    const recipes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRecipes(recipes);
  };

  const suggestRecipe = async () => {
    try {
      const inventoryItems = inventory.map(item => `${item.quantity}x ${item.name}`).join(", ");
      const prompt = `Suggest a recipe using the following ingredients: ${inventoryItems}. Make sure you give response in this format:
      {
          title: "Vegetable Stir-Fry",
          excerpt: "A colorful and flavorful stir-fry with a variety of fresh vegetables and a savory sauce",
          content: "FULL RECIPE CONTENT HERE"
      }`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let recipe = JSON.parse(response.text());

      const docRef = await addDoc(collection(db, "recipes"), recipe);
      fetchRecipes();
      openRecipeModal(recipe);
    } catch (error) {
      console.error("Error suggesting recipe:", error);
    }
  };

  const openRecipeModal = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  return (
    <div className="phonehome">
      <div className="header-mobile">
        <div className="top-page-title-account">
          <div className="everything-inventory-list">
            Everything Inventory List
          </div>
          <div className="account-related-links">
            <span className="my-account">my account</span>
          </div>
        </div>
        <Button onClick={suggestRecipe}>Suggest Recipe</Button>
      </div>
      <div className='flex'>
        <div className='flex-grow'>
            <div className="add-block">
            <div className="button-grid">
              <div className="container-3">
                <div className="button-input">
                  <Image 
                    className="text-underline" 
                    src="/assets/images/TextAUnderline.png"
                    alt="Text Aunderline" 
                    width={22}
                    height={22}
                  />
                  <div className="name">Name</div>
                </div>
                <div className="button-input-1">
                  <img className="camera" src="assets/vectors/Camera_x2.svg" alt="Camera" />
                  <div className="picture">Picture</div>
                </div>
              </div>
              <div className="container-1">
                <div className="button-input-2">
                  <img className="plus-square" src="assets/vectors/PlusSquare4_x2.svg" alt="Plus Square" />
                  <div className="quantity">Quantity</div>
                </div>
                <div className="button-input-3">
                  <img className="storefront" src="assets/vectors/Storefront2_x2.svg" alt="Storefront" />
                  <div className="origin">Origin</div>
                </div>
                <div className="button-input-4">
                  <img className="calendar-blank" src="assets/vectors/CalendarBlank2_x2.svg" alt="Calendar Blank" />
                  <div className="date">Date</div>
                </div>
              </div>
              <div className="container-9">
                <div className="button-input-5">
                  <img className="currency-dollar" src="assets/vectors/CurrencyDollar2_x2.svg" alt="Currency Dollar" />
                  <div className="price">Price</div>
                </div>
                <div className="button-input-6">
                  <img className="text-align-left" src="assets/vectors/TextAlignLeft3_x2.svg" alt="Text Align Left" />
                  <div className="notes">Notes</div>
                </div>
              </div>
              <div className="button-input-7">
                <img className="hash" src="assets/vectors/Hash2_x2.svg" alt="Hash" />
                <div className="filtering-tag">Filtering tag</div>
                </div>
              </div>
              <div className="bg-muted/20 rounded-lg p-8 space-y-5 space-x-100">
                    <h2 className="text-lg font-semibold">Recipes</h2>
                    <div className="space-y-2">
                      {recipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="flex items-start justify-between gap-4 hover:bg-muted/50 rounded-md p-2 transition-colors"
                        >
                          <div>
                            <h3 className="font-medium">{recipe.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">{recipe.excerpt}</p>
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => openRecipeModal(recipe)}>
                            <ArrowRightIcon className="w-4 h-4" />
                            <span className="sr-only">Read more</span>
                          </Button>
                        </div>
                      ))}
                </div>
              </div>
              <Dialog open={showRecipeModal} onOpenChange={setShowRecipeModal}>
              <DialogContent className="sm:max-w-[600px] max-h-[600px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedRecipe?.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <p>{selectedRecipe?.excerpt}</p>
                  <p>
                    <Markdown>{selectedRecipe?.content}</Markdown>
                  </p>
                </div>
                <DialogFooter>
                  <div>
                    <Button variant="outline">Close</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
            
          </div>
              
            </div>
          </div>
  );
}