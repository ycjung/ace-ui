
function getCropName(key){
    for(var i=0;i<cropcode.code.length;i++){
        if(key == cropcode.code[i].ID){
                return cropcode.code[i].Crop;
                break;
        }
    }
    return 'Unknown';
}

/**
 * CropID - Real Name defined by ICASA
 */
var cropcode = { "code" : 
	[
		{ "ID" : "AL", "Crop" : "Alfalfa/Lucerne" },
		{ "ID" : "BA", "Crop" : "Barley" },
		{ "ID" : "G0", "Crop" : "Bahia grass" },
		{ "ID" : "BW", "Crop" : "Broad leaf weeds" },
		{ "ID" : "BN", "Crop" : "Dry bean" },
		{ "ID" : "GB", "Crop" : "Green bean" },
		{ "ID" : "NN", "Crop" : "Banana" },
		{ "ID" : "BR", "Crop" : "Brachiaria" },
		{ "ID" : "CM", "Crop" : "Camelina" },
		{ "ID" : "CB", "Crop" : "Cabbage" },
		{ "ID" : "CC", "Crop" : "Coconut" },
		{ "ID" : "CF", "Crop" : "Coffee" },
		{ "ID" : "CH", "Crop" : "Chickpea" },
		{ "ID" : "CT", "Crop" : "Citrus" },
		{ "ID" : "CV", "Crop" : "Clover" },
		{ "ID" : "CN", "Crop" : "Canola" },
		{ "ID" : "CO", "Crop" : "Cotton" },
		{ "ID" : "CR", "Crop" : "Crambe" },
		{ "ID" : "CS", "Crop" : "Cassava" },
		{ "ID" : "CP", "Crop" : "Cowpea" },
		{ "ID" : "FA", "Crop" : "Fallow" },
		{ "ID" : "FB", "Crop" : "Faba bean" },
		{ "ID" : "GR", "Crop" : "Grass vegetations" },
		{ "ID" : "GW", "Crop" : "Grass weeds" },
		{ "ID" : "LN", "Crop" : "Lentil" },
		{ "ID" : "MZ", "Crop" : "Maize" },
		{ "ID" : "NP", "Crop" : "Napier grass" },
		{ "ID" : "OA", "Crop" : "Oats" },
		{ "ID" : "PE", "Crop" : "Pea" },
		{ "ID" : "PP", "Crop" : "Pigeonpea" },
		{ "ID" : "ML", "Crop" : "Pearl millet" },
		{ "ID" : "PI", "Crop" : "Pineapple" },
		{ "ID" : "PN", "Crop" : "Peanut" },
		{ "ID" : "PT", "Crop" : "Potato" },
		{ "ID" : "PO", "Crop" : "Perennial peanut" },
		{ "ID" : "PR", "Crop" : "Capsicum pepper" },
		{ "ID" : "RA", "Crop" : "Rape" },
		{ "ID" : "RP", "Crop" : "Rhizoma peanut" },
		{ "ID" : "RI", "Crop" : "Rice" },
		{ "ID" : "SB", "Crop" : "Soybean" },
		{ "ID" : "BS", "Crop" : "Beet sugar" },
		{ "ID" : "SS", "Crop" : "Sesame" },
		{ "ID" : "SG", "Crop" : "Grain sorghum" },
		{ "ID" : "ST", "Crop" : "Shrubs/trees" },
		{ "ID" : "SC", "Crop" : "Sugarcane" },
		{ "ID" : "SU", "Crop" : "Sunflower" },
		{ "ID" : "SW", "Crop" : "Sweet corn" },
		{ "ID" : "SI", "Crop" : "Switch grass" },
		{ "ID" : "SP", "Crop" : "Sweet potato" },
		{ "ID" : "TN", "Crop" : "Tanier" },
		{ "ID" : "TR", "Crop" : "Taro" },
		{ "ID" : "TM", "Crop" : "Tomato" },
		{ "ID" : "TL", "Crop" : "Triticale" },
		{ "ID" : "VB", "Crop" : "Velvet bean" },
		{ "ID" : "VI", "Crop" : "Wine grape" },
		{ "ID" : "WH", "Crop" : "Bread wheat" }
	] 
};