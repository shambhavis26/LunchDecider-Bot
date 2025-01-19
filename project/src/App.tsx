import React, { useState, useCallback } from 'react';
import { ChevronRight, Utensils, Dice1Icon as DiceIcon, Filter, X, Settings2, Leaf, Beef, Carrot, Heart, Pizza } from 'lucide-react';

// Sample lunch options with cuisines, dietary preferences, and food types
const lunchOptions = {
  veg: {
    healthy: [
      { name: "Greek Salad", cuisine: "Mediterranean" },
      { name: "Quinoa Buddha Bowl", cuisine: "International" },
      { name: "Roasted Vegetable Wrap", cuisine: "International" },
      { name: "Lentil Soup", cuisine: "Mediterranean" },
      { name: "Steamed Vegetable Dumplings", cuisine: "Asian" }
    ],
    comfort: [
      { name: "Margherita Pizza", cuisine: "Italian" },
      { name: "Mac and Cheese", cuisine: "American" },
      { name: "Paneer Tikka Masala", cuisine: "Indian" },
      { name: "Mushroom Risotto", cuisine: "Italian" },
      { name: "Vegetable Biryani", cuisine: "Indian" }
    ]
  },
  nonVeg: {
    healthy: [
      { name: "Grilled Chicken Salad", cuisine: "International" },
      { name: "Baked Salmon", cuisine: "International" },
      { name: "Turkey Lettuce Wraps", cuisine: "Asian" },
      { name: "Chicken Quinoa Bowl", cuisine: "International" },
      { name: "Tuna Poke Bowl", cuisine: "Japanese" }
    ],
    comfort: [
      { name: "Beef Burger", cuisine: "American" },
      { name: "Butter Chicken", cuisine: "Indian" },
      { name: "BBQ Ribs", cuisine: "American" },
      { name: "Chicken Alfredo", cuisine: "Italian" },
      { name: "Fish & Chips", cuisine: "British" }
    ]
  },
  vegan: {
    healthy: [
      { name: "Acai Bowl", cuisine: "International" },
      { name: "Chickpea Buddha Bowl", cuisine: "International" },
      { name: "Kale and Quinoa Salad", cuisine: "International" },
      { name: "Raw Veggie Sushi Rolls", cuisine: "Japanese" },
      { name: "Mediterranean Falafel Bowl", cuisine: "Mediterranean" }
    ],
    comfort: [
      { name: "Beyond Meat Burger", cuisine: "American" },
      { name: "Vegan Mac and Cheese", cuisine: "American" },
      { name: "Chickpea Curry", cuisine: "Indian" },
      { name: "Vegan Pizza", cuisine: "Italian" },
      { name: "Black Bean Tacos", cuisine: "Mexican" }
    ]
  }
};

function App() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDeciding, setIsDeciding] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [customizeStep, setCustomizeStep] = useState<1 | 2>(1);
  const [dietaryPreference, setDietaryPreference] = useState<'veg' | 'nonVeg' | 'vegan' | null>(null);
  const [foodType, setFoodType] = useState<'healthy' | 'comfort' | null>(null);

  const cuisines = [...new Set(
    Object.values(lunchOptions)
      .flatMap(types => Object.values(types))
      .flat()
      .map(option => option.cuisine)
  )];

  const decideLunch = useCallback(() => {
    setIsDeciding(true);
    let availableOptions = [];
    
    if (dietaryPreference && foodType) {
      availableOptions = lunchOptions[dietaryPreference][foodType];
    } else if (dietaryPreference) {
      availableOptions = [...lunchOptions[dietaryPreference].healthy, ...lunchOptions[dietaryPreference].comfort];
    } else {
      availableOptions = Object.values(lunchOptions)
        .flatMap(types => [...types.healthy, ...types.comfort]);
    }

    const filteredOptions = selectedCuisine
      ? availableOptions.filter(option => option.cuisine === selectedCuisine)
      : availableOptions;

    let count = 0;
    const interval = setInterval(() => {
      const randomOption = filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
      setSelectedOption(randomOption.name);
      count++;
      
      if (count > 10) {
        clearInterval(interval);
        setIsDeciding(false);
      }
    }, 100);
  }, [selectedCuisine, dietaryPreference, foodType]);

  const handleNext = () => {
    if (dietaryPreference) {
      setCustomizeStep(2);
    }
  };

  const handleSaveAndReturn = () => {
    setShowCustomize(false);
    setCustomizeStep(1);
  };

  const FloatingEmoji = ({ emoji, className = "" }) => (
    <span className={`floating-emoji text-4xl absolute ${className}`}>{emoji}</span>
  );

  const CustomizeDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all relative">
        <FloatingEmoji emoji="🌱" className="top-0 -left-8" />
        <FloatingEmoji emoji="🥩" className="top-0 -right-8" />
        {customizeStep === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-ketchup mb-6 text-center">Choose Your Diet 🍽️</h2>
            <div className="space-y-4">
              {[
                { type: 'veg', icon: Carrot, label: 'Vegetarian', emoji: '🥗' },
                { type: 'nonVeg', icon: Beef, label: 'Non-Vegetarian', emoji: '🍖' },
                { type: 'vegan', icon: Leaf, label: 'Vegan', emoji: '🌱' }
              ].map(({ type, icon: Icon, label, emoji }) => (
                <button
                  key={type}
                  onClick={() => setDietaryPreference(type as 'veg' | 'nonVeg' | 'vegan')}
                  className={`w-full p-4 rounded-lg flex items-center space-x-3 transition-all ${
                    dietaryPreference === type
                      ? 'bg-mustard bg-opacity-20 border-2 border-mustard'
                      : 'bg-gray-50 hover:bg-mustard hover:bg-opacity-10 border-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${dietaryPreference === type ? 'text-mustard' : 'text-gray-600'}`} />
                  <span className="text-lg font-medium">{label} {emoji}</span>
                  {dietaryPreference === type && (
                    <ChevronRight className="w-5 h-5 text-mustard ml-auto" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!dietaryPreference}
              className={`mt-6 w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                dietaryPreference
                  ? 'bg-ketchup text-white hover:bg-opacity-90'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-ketchup mb-6 text-center">Choose Food Type 🍳</h2>
            <div className="space-y-4">
              {[
                { type: 'healthy', icon: Heart, label: 'Healthy', emoji: '🥗' },
                { type: 'comfort', icon: Pizza, label: 'Comfort Food', emoji: '🍕' }
              ].map(({ type, icon: Icon, label, emoji }) => (
                <button
                  key={type}
                  onClick={() => setFoodType(type as 'healthy' | 'comfort')}
                  className={`w-full p-4 rounded-lg flex items-center space-x-3 transition-all ${
                    foodType === type
                      ? 'bg-mustard bg-opacity-20 border-2 border-mustard'
                      : 'bg-gray-50 hover:bg-mustard hover:bg-opacity-10 border-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${foodType === type ? 'text-mustard' : 'text-gray-600'}`} />
                  <span className="text-lg font-medium">{label} {emoji}</span>
                  {foodType === type && (
                    <ChevronRight className="w-5 h-5 text-mustard ml-auto" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCustomizeStep(1)}
                className="w-1/2 py-3 px-6 rounded-lg font-semibold border-2 border-ketchup text-ketchup hover:bg-ketchup hover:bg-opacity-10 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSaveAndReturn}
                disabled={!foodType}
                className={`w-1/2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  foodType
                    ? 'bg-ketchup text-white hover:bg-opacity-90'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save & Return
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-ketchup to-mustard bg-opacity-10 p-6 relative overflow-hidden">
      <FloatingEmoji emoji="🍔" className="top-10 left-10" />
      <FloatingEmoji emoji="🍕" className="top-20 right-20" />
      <FloatingEmoji emoji="🥗" className="bottom-10 left-20" />
      <FloatingEmoji emoji="🍜" className="bottom-20 right-10" />
      
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-ketchup to-mustard"></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Utensils className="w-6 h-6 text-ketchup" />
              <h1 className="text-2xl font-bold text-ketchup">Lunch Decider</h1>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full hover:bg-mustard hover:bg-opacity-10 transition-colors"
              title="Filter cuisines"
            >
              <Filter className="w-5 h-5 text-mustard" />
            </button>
          </div>

          {showFilters && (
            <div className="mb-6 p-4 bg-gradient-to-r from-ketchup to-mustard bg-opacity-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-ketchup">Filter by Cuisine 🌎</h2>
                <button
                  onClick={() => setSelectedCuisine(null)}
                  className="text-xs text-mustard hover:text-opacity-80"
                >
                  Clear filter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cuisines.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => setSelectedCuisine(cuisine)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCuisine === cuisine
                        ? 'bg-mustard text-white'
                        : 'bg-white border border-mustard text-mustard hover:bg-mustard hover:bg-opacity-10'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-ketchup to-mustard bg-opacity-5 rounded-lg p-6 text-center mb-6">
            {selectedOption ? (
              <div className={`text-xl font-semibold text-ketchup ${isDeciding ? 'animate-pulse' : ''}`}>
                {selectedOption} ✨
              </div>
            ) : (
              <div className="text-mustard">
                Click the dice to decide what's for lunch! 🎲
              </div>
            )}
          </div>

          <button
            onClick={() => setShowCustomize(true)}
            className="w-full mb-4 py-3 px-6 rounded-lg flex items-center justify-center space-x-2 text-mustard font-semibold border-2 border-mustard hover:bg-mustard hover:bg-opacity-10 transition-colors"
          >
            <Settings2 className="w-5 h-5" />
            <span>Customize 🎯</span>
          </button>

          <button
            onClick={decideLunch}
            disabled={isDeciding}
            className={`w-full py-3 px-6 rounded-lg flex items-center justify-center space-x-2 text-white font-semibold transition-all ${
              isDeciding
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-ketchup hover:bg-opacity-90 active:scale-95'
            }`}
          >
            <DiceIcon className={`w-5 h-5 ${isDeciding ? 'animate-spin' : ''}`} />
            <span>{isDeciding ? 'Deciding... 🎲' : 'Decide Lunch! 🎲'}</span>
          </button>

          {(selectedCuisine || dietaryPreference || foodType) && (
            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
              {selectedCuisine && (
                <span className="text-sm text-gray-500 flex items-center">
                  Cuisine: {selectedCuisine} 🌎
                  <button
                    onClick={() => setSelectedCuisine(null)}
                    className="ml-2 text-ketchup hover:text-opacity-80"
                  >
                    <X className="w-4 h-4 inline" />
                  </button>
                </span>
              )}
              {dietaryPreference && (
                <span className="text-sm text-gray-500 flex items-center">
                  Diet: {dietaryPreference === 'nonVeg' ? 'Non-Vegetarian 🍖' : dietaryPreference === 'veg' ? 'Vegetarian 🥗' : 'Vegan 🌱'}
                  <button
                    onClick={() => {
                      setDietaryPreference(null);
                      setFoodType(null);
                    }}
                    className="ml-2 text-ketchup hover:text-opacity-80"
                  >
                    <X className="w-4 h-4 inline" />
                  </button>
                </span>
              )}
              {foodType && (
                <span className="text-sm text-gray-500 flex items-center">
                  Type: {foodType === 'healthy' ? 'Healthy 🥗' : 'Comfort Food 🍕'}
                  <button
                    onClick={() => setFoodType(null)}
                    className="ml-2 text-ketchup hover:text-opacity-80"
                  >
                    <X className="w-4 h-4 inline" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {showCustomize && <CustomizeDialog />}
    </div>
  );
}

export default App;