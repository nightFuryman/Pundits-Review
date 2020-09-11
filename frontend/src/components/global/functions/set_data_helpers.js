// ======================================
// Helper Functions to set data depending on player/club in view
// ======================================


// ===========
// IMPORTS 
// ===========



// Local JS Imports
import { previousMonday, localCrawlDate } from "../../constants/dates";
import { country_codes } from '../resources/ISO_COUNTRY_CODES';
import { club_badges } from '../resources/club_badges';


// Function to set review score

export function setReviewScore(targetData, clubOrPlayer) {

	let arrayKey = "scores";

	if (clubOrPlayer) {
		arrayKey = "club_scores";
	}

	// Filter Scores array for score that matches latest crawl date
	let latestReviewScore = targetData[arrayKey].filter(function(score) {

	  	// For local use
	  	return score.date.toString() === localCrawlDate;
    	// For Deployment
    	//return score.date.toString() == previousMonday;

	})

	let sentiment_score;

	if (latestReviewScore[0]) {

		if (latestReviewScore[0].n_positive + latestReviewScore[0].n_negative > 3) {
			sentiment_score = Math.round(latestReviewScore[0].sentiment_score * 100)
		} else {
			sentiment_score = "N/A"
		}

	    return [sentiment_score, latestReviewScore[0].n_positive, latestReviewScore[0].n_negative, latestReviewScore[0].total_reviews];

	} else {

		sentiment_score = "N/A"

	    return [sentiment_score, 0, 0, 0];
	}
}


// Function to set review sentences

export function setReviewSentences(targetData, clubOrPlayer) {

	let arrayKey = "sentences";

	if (clubOrPlayer) {
		arrayKey = "club_sentences";
	}

	let latestSentences = targetData[arrayKey].filter(function(sentence) {

		// For Local Use
		return sentence.date.toString() === localCrawlDate;
		// For Deployment
    	//return score.date.toString() == previousMonday;

	})

	if (latestSentences[0]) {
		
		return latestSentences;
	} else {
		
		return [];
	}
}

// Function to set review sentences for a specific date

export function setReviewSentencesSpecificDate(targetData, specificDate, clubOrPlayer) {

	let arrayKey = "sentences";

	if (clubOrPlayer) {
		arrayKey = "club_sentences";
	}

	let latestSentences = targetData[arrayKey].filter(function(sentence) {

		// For Local Use
		return sentence.date.toString() === specificDate;
		// For Deployment
    	//return score.date.toString() == previousMonday;

	})

	if (latestSentences[0]) {
		
		return latestSentences;
	} else {
		
		return [];
	}
}

// Function to set player flag

export function flagFinder(playerNationality) {

	let countryCode = undefined;

	let playerNationalitySearchTerm = playerNationality

	if (playerNationality == "England" || playerNationality == "Scotland" || playerNationality == "Northern Ireland" || playerNationality == "Wales") {

		playerNationalitySearchTerm = "United Kingdom of Great Britain and Northern Ireland"
	}

	country_codes.forEach(function(country) {


		if (country.name.toString() === playerNationalitySearchTerm) {

			countryCode = "flag-icon-player-page-info-container flag-icon flag-icon-" + country["alpha-2"].toString().toLowerCase();
			
		}
	})

	return countryCode;

}


// Function to set player club badge

export function badgeFinder(playerClub) {

	let clubBadgeClassName;

	Object.keys(club_badges).forEach(function(club) {

		if (playerClub.toString() === club.toString()) {

			clubBadgeClassName = "club-badge " + club_badges[club];
		};
	})

	return clubBadgeClassName;

}



// Function to shuffle array
// Code taken from Stack Overflow post by community wiki / CoolAJ86 on Feb 22 2020
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Accessed August 13 2020

export function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


// End of referenced code

export function sortArray(list, propertyValue, reverse) {

	// Code to sort array adapted from flaviocopes post on Dec 06 2018
	// https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
	// Accessed Aug 18 2020
	if (reverse) {

		return list.sort((a, b) => (a[propertyValue] > b[propertyValue]) ? -1 : 1);
	} 

	return list.sort((a, b) => (a[propertyValue] > b[propertyValue]) ? 1 : -1);

	// End of referenced code
}


// Function to delete specified item from array
export function deleteItemFromArray(list, item) {

	return list.filter(element => element != item);
}


// Function to set position filter
function setPositionFilter(player, filterSettings) {

	if (filterSettings.position.length) {

		if (filterSettings.position.includes(player.field_position)) {

			return true;

		} else {

			return false;
		}

	} 

	// True signifies that player passes position filter test
	return true;

}

// Function to set club filter
function setClubFilter(player, filterSettings) {

	if (filterSettings.club.length) {

		if (filterSettings.club.includes(player.club)) {

			return true;
			
		} else {

			return false;
		}

	} 

	// True signifies that player passes club filter test
	return true;

}

// Function to set nationality filter
function setNationalityFilter(player, filterSettings) {

	if (filterSettings.nationality.length) {

		if (filterSettings.nationality.includes(player.nationality)) {

			return true;
			
		} else {
			
			return false;
		}

	} 

	// True signifies that player passes nationality filter test
	return true;

}
// Function to set filter 
export function setFilter(player, filterSettings) {

	let positionFilterTest = setPositionFilter(player, filterSettings);
	let clubFilterTest = setClubFilter(player, filterSettings);
	let nationalityFilterTest = setNationalityFilter(player, filterSettings);

	

	// Return true if player passes all filter tests 
	if (positionFilterTest && clubFilterTest && nationalityFilterTest) {

		return true;

	} else {

		return false;

	}
}

// Function to get root url
export function getRootUrl(url) {
  return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
}


// Function to return array of unique objects 
// Code taken from Stack Overflow post by Mμ on Jun 17 2017
// https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript
// Accessed Aug 16 2020 

export function uniqueArrayOfObjects(myData) {
     return Array.from(new Set(myData.map(JSON.stringify))).map(JSON.parse);
 }


 // End of referenced code


 // Function to calculate average score from scores array 
 export let calculateAvg = function(scoresArray) {

	  let scoreCounter = 0;
	  
	  scoresArray.forEach(function(scoreItem) {

	    if (scoreItem.sentiment_score > -1 && (scoreItem.n_negative + scoreItem.n_positive) > 5) {

	      scoreCounter += scoreItem.sentiment_score

	    }

	  })

	  if (scoreCounter > 0) {

	    return scoreCounter / scoresArray.length;

	  } else {

	    return null;

	  }

	  
	  
}



 // Function to calculate  ---> total positive negative scores from an array of scores
 export let calculateSeasonScores = function(scoresArray) {

	  let positiveCounter = 0;
	  let negativeCounter = 0;
	  let totalCounter = 0;
	  
	  scoresArray.forEach(function(scoreItem) {

	    positiveCounter += scoreItem.n_positive;
	    negativeCounter += scoreItem.n_negative;
	    totalCounter += scoreItem.total_reviews;

	  })

	  return [positiveCounter, negativeCounter, totalCounter];

	  
}


// Function to return array value where date matches current date
export function returnDateMatchArray(scoresArray) {

	let correctDateArray = [];

	scoresArray.forEach(function(item) {

		if (item.date === localCrawlDate) {
			correctDateArray.push(item)
		}
	})
	
	return correctDateArray;

}


export function returnSpecificDateMatchArray(scoresArray, specificDate) {

	let correctDateArray = [];

	scoresArray.forEach(function(item) {

		if (item.date === specificDate) {
			correctDateArray.push(item)
		}
	})
	
	return correctDateArray;
}


