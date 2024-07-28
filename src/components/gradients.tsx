import { LinearGradientProps } from "expo-linear-gradient";

const gradients = [
  { name: "Oceanic", colors: ["#0093ef", "#80d0c7"] },
  { name: "Cotton Candy", colors: ["#D9AFD9", "#97D9E1"] },
  { name: "Sunset", colors: ["#FAD961", "#F76B1C"] },
  { name: "Beachside", colors: ["#00CDAC", "#02AAB0"] },
  { name: "Peachy", colors: ["#FFA751", "#FFE259"] },
  { name: "Pumpkin", colors: ["#D4145A", "#FBB03B"] },
  { name: "Arendelle", colors: ["#9796F0", "#FBC7D4"] },
  { name: "High Tide", colors: ["#0082C8", "#667DB6"] },
  { name: "Lavender", colors: ["#EECDA3", "#EF629F"] },
  { name: "Mango", colors: ["#ffe259", "#ffa751"] },
  { name: "Grape", colors: ["#DA22FF", "#9733EE"] },
  { name: "Cherry", colors: ["#EB3349", "#F45C43"] },
  { name: "Flamingo", colors: ["#FAD0C4", "#FFD1FF"] },
  { name: "Aqua Marine", colors: ["#1A2980", "#26D0CE"] },
  { name: "Forest", colors: ["#5A3F37", "#2C7744"] },
  { name: "Royal Blue", colors: ["#536976", "#292E49"] },
  { name: "Tropical", colors: ["#37ECBA", "#72AFD3"] },
  { name: "Autumn", colors: ["#D38312", "#A83279"] },
  { name: "Sahara", colors: ["#FE8C00", "#F83600"] },
  { name: "Blush", colors: ["#B24592", "#F15F79"] },
];

export function getRandomGradient(): LinearGradientProps["colors"] {
  const randomIndex = Math.floor(Math.random() * gradients.length);
  return gradients[randomIndex].colors;
}
