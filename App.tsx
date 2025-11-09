import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
// import { analyzePersonInImage, visualizeOutfitOnPerson, visualizeAccessoryOnPerson } from './services/geminiService';
import { analyzePersonInImage } from './services/geminiService';
import type { AnalysisResult, ClothingItem, AccessoryItem, VisualizationParams, OutfitSuggestion, AccessorySuggestion } from './types';
import { Disclaimer } from './components/Disclaimer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { VirtualTryOnDisplay } from './components/VirtualTryOnDisplay';
import { ClothingCatalog } from './components/ClothingCatalog';
import { AccessoryCatalog } from './components/AccessoryCatalog';
import { femaleClothingCatalog } from './data/femaleCatalog';
import { maleClothingCatalog } from './data/maleCatalog';
import { accessoryCatalog } from './data/accessoryCatalog';
import { GenderFemaleIcon } from './components/icons/GenderFemaleIcon';
import { GenderMaleIcon } from './components/icons/GenderMaleIcon';
import { JewelryIcon } from './components/icons/JewelryIcon';
import { WardrobeIcon } from './components/icons/WardrobeIcon';

type WardrobeType = 'clothing' | 'accessories';
type Gender = 'female' | 'male';

type LastVisualizedItem = 
    | { type: 'clothing'; item: ClothingItem; color: string }
    | { type: 'accessory'; item: AccessoryItem }
    | { type: 'suggestion'; item: OutfitSuggestion };

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [virtualTryOnImage, setVirtualTryOnImage] = useState<string | null>(null);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [visualizingItemName, setVisualizingItemName] = useState<string | null>(null);
  
  const [activeWardrobeType, setActiveWardrobeType] = useState<WardrobeType>('clothing');
  const [activeGender, setActiveGender] = useState<Gender>('female');
  
  const [visualizationParams, setVisualizationParams] = useState<VisualizationParams>({ 
    fit: 'Regular', 
    realism: 50,
    lighting: 'Natural',
    background: 'Original',
    imageStyle: 'Photorealistic',
    pose: 'As Is',
  });
  const [lastVisualizedItem, setLastVisualizedItem] = useState<LastVisualizedItem | null>(null);


  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setAnalysisResult(null);
    setVirtualTryOnImage(null);
    setLastVisualizedItem(null);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(',')[1];
      if(base64data) {
        setBase64Image(base64data);
      }
    };
  };

  const handleAnalysis = useCallback(async () => {
    if (!imageFile || !base64Image) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setVirtualTryOnImage(null);
    setLastVisualizedItem(null);

    try {
      const result = await analyzePersonInImage(base64Image, imageFile.type);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, base64Image]);
  
  const handleVisualizeClothing = useCallback(async (item: ClothingItem, color: string) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    if (!base64Image || !imageFile) {
      setError('An image is required for virtual try-on.');
      return;
    }
    
    setLastVisualizedItem({ type: 'clothing', item, color });
    setIsVisualizing(true);
    setVirtualTryOnImage(null);
    setVisualizingItemName(item.name);
    setError(null);
    
    try { // Feature disabled as the underlying model is not available.
      // const generatedImage = await visualizeOutfitOnPerson(base64Image, imageFile.type, item.name, item.description, color, visualizationParams);
      // setVirtualTryOnImage(generatedImage);
      throw new Error("The virtual try-on feature is currently disabled as the underlying AI model is no longer available.");
    } catch (err) { 
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during visualization.');
    } finally {
      setIsVisualizing(false);
      setVisualizingItemName(null);
    }
    
  }, [base64Image, imageFile, visualizationParams]);

  const handleVisualizeAccessory = useCallback(async (item: AccessoryItem | AccessorySuggestion) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    if (!base64Image || !imageFile) {
      setError('An image is required for virtual try-on.');
      return;
    }
    
    const accessoryDetails: AccessoryItem = 'id' in item ? item : { ...item, id: 0, category: 'Jewelry' };
    setLastVisualizedItem({ type: 'accessory', item: accessoryDetails });

    setIsVisualizing(true);
    setVirtualTryOnImage(null);
    setVisualizingItemName(item.name);
    setError(null);
    
    try { // Feature disabled as the underlying model is not available.
      // const generatedImage = await visualizeAccessoryOnPerson(base64Image, imageFile.type, accessoryDetails, visualizationParams);
      // setVirtualTryOnImage(generatedImage);
      throw new Error("The virtual try-on feature is currently disabled as the underlying AI model is no longer available.");
    } catch (err) { 
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during accessory visualization.');
    } finally {
      setIsVisualizing(false);
      setVisualizingItemName(null);
    }
    
  }, [base64Image, imageFile, visualizationParams]);

  const handleVisualizeSuggestion = useCallback(async (item: OutfitSuggestion) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    if (!base64Image || !imageFile) {
      setError('An image is required for virtual try-on.');
      return;
    }

    setLastVisualizedItem({ type: 'suggestion', item });
    setIsVisualizing(true);
    setVirtualTryOnImage(null);
    setVisualizingItemName(item.name);
    setError(null);
    
    try { // Feature disabled as the underlying model is not available.
      // const generatedImage = await visualizeOutfitOnPerson(base64Image, imageFile.type, item.name, item.description, '', visualizationParams);
      // setVirtualTryOnImage(generatedImage);
      throw new Error("The virtual try-on feature is currently disabled as the underlying AI model is no longer available.");
    } catch (err) { 
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during visualization.');
    } finally {
      setIsVisualizing(false);
      setVisualizingItemName(null);
    }
    
  }, [base64Image, imageFile, visualizationParams]);

  const handleRetouch = useCallback(() => {
    if (!lastVisualizedItem) return;
    if (lastVisualizedItem.type === 'clothing') {
        handleVisualizeClothing(lastVisualizedItem.item, lastVisualizedItem.color);
    } else if (lastVisualizedItem.type === 'accessory') {
        handleVisualizeAccessory(lastVisualizedItem.item);
    } else if (lastVisualizedItem.type === 'suggestion') {
        handleVisualizeSuggestion(lastVisualizedItem.item);
    }
  }, [lastVisualizedItem, handleVisualizeClothing, handleVisualizeAccessory, handleVisualizeSuggestion]);


  const clearVirtualTryOn = () => {
    setVirtualTryOnImage(null);
    setLastVisualizedItem(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <p className="text-center text-gray-600 mb-6">
            Upload a full-body photo to get AI-powered measurements, size recommendations, and style suggestions.
          </p>
          <ImageUploader onImageUpload={handleImageUpload} onAnalyze={handleAnalysis} isLoading={isLoading} />
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
        </div>

        {isLoading && <LoadingSpinner />}
        
        {/* {isVisualizing && !virtualTryOnImage && <LoadingSpinner message="Dressing up your virtual model..." subMessage="Our AI stylist is creating your new look."/>}

        {virtualTryOnImage && base64Image && (
            <VirtualTryOnDisplay 
                originalImageUrl={`data:${imageFile?.type};base64,${base64Image}`}
                generatedImageUrl={virtualTryOnImage}
                onClear={clearVirtualTryOn}
                visualizationParams={visualizationParams}
                onParamsChange={setVisualizationParams}
                onRetouch={handleRetouch}
                isVisualizing={isVisualizing}
            />
        )} */}

        {analysisResult && (
          <div className="mt-8 max-w-4xl mx-auto space-y-8">
            <ResultsDisplay 
              result={analysisResult} 
              onVisualizeSuggestion={handleVisualizeSuggestion}
              onVisualizeAccessory={handleVisualizeAccessory}
              isVisualizing={isVisualizing}
              visualizingItemName={visualizingItemName}
            />
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                   {/* Main Wardrobe Type Toggle */}
                   <div className="flex gap-2 p-1 bg-gray-100 rounded-full">
                        <button
                            onClick={() => setActiveWardrobeType('clothing')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                                activeWardrobeType === 'clothing' ? 'bg-white text-indigo-700 shadow' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <WardrobeIcon className="w-5 h-5" />
                            Virtual Wardrobe
                        </button>
                        <button
                            onClick={() => setActiveWardrobeType('accessories')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                                activeWardrobeType === 'accessories' ? 'bg-white text-indigo-700 shadow' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <JewelryIcon className="w-5 h-5" />
                           Accessory Wardrobe
                        </button>
                   </div>
                   {/* Gender Toggle - appears only for clothing */}
                   {activeWardrobeType === 'clothing' && (
                       <div className="flex gap-2 p-1 bg-gray-100 rounded-full">
                            <button
                                onClick={() => setActiveGender('female')}
                                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                                    activeGender === 'female' ? 'bg-white text-pink-600 shadow' : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <GenderFemaleIcon className="w-5 h-5" />
                                Female
                            </button>
                            <button
                                onClick={() => setActiveGender('male')}
                                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                                    activeGender === 'male' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <GenderMaleIcon className="w-5 h-5" />
                                Male
                            </button>
                       </div>
                   )}
                </div>

                <div>
                    {activeWardrobeType === 'clothing' && activeGender === 'female' && (
                         <ClothingCatalog 
                            key="female"
                            items={femaleClothingCatalog}
                            onVisualize={handleVisualizeClothing}
                            isVisualizing={isVisualizing}
                            visualizingItemName={visualizingItemName}
                          />
                    )}
                    {activeWardrobeType === 'clothing' && activeGender === 'male' && (
                        <ClothingCatalog 
                            key="male"
                            items={maleClothingCatalog}
                            onVisualize={handleVisualizeClothing}
                            isVisualizing={isVisualizing}
                            visualizingItemName={visualizingItemName}
                          />
                    )}
                    {activeWardrobeType === 'accessories' && (
                        <AccessoryCatalog
                            items={accessoryCatalog}
                            onVisualize={handleVisualizeAccessory}
                            isVisualizing={isVisualizing}
                            visualizingItemName={visualizingItemName}
                        />
                    )}
                </div>
            </div>
          </div>
        )}

        <Disclaimer />

      </main>
    </div>
  );
};

export default App;