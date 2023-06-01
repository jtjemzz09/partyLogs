const newPartyForm = document.querySelector('#new-party-form');
const partyContainer = document.querySelector('#party-container');

const PARTIES_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/parties';
const GUESTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/guests';
const RSVPS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/rsvps';
const GIFTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/gifts';

// Get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.error(error);
  }
};

// Get single party by id
const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};

// Delete party
const deleteParty = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      return true;
    } else {
      throw new Error('Failed to delete party');
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Render a single party by id
const renderSinglePartyById = async (id) => {
  try {
    // Fetch party details from server
    const party = await getPartyById(id);

    // GET - /api/workshop/guests/party/:partyId - get guests by party id
    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    const guests = await guestsResponse.json();

    // GET - /api/workshop/rsvps/party/:partyId - get RSVPs by partyId
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();

    // // // GET - get all gifts by party id - /api/workshop/parties/gifts/:partyId
    // const giftsResponse = await fetch(`${GIFTS_API_URL}/gifts/${id}`);
    // const gifts = await giftsResponse.json();

   
    

    // Create new HTML element to display party details
    const partyDetailsElement = document.createElement('div');
    partyDetailsElement.classList.add('party-details');
    partyDetailsElement.innerHTML = `
      <h2>${party.name}</h2>
      <p>${party.description}</p>
      <p>${party.date}</p>
      <p>${party.time}</p>
      <p>${party.location}</p>
      <h3>Guests:</h3>
      <ul>
        ${guests
          .map(
            (guest, index) => `
              <li>
                <div>${guest.name}</div>
                <div>${rsvps[index].status}</div>
              </li>
            `
          )
          .join('')}
      </ul>
       <h3>Gifts:</h3>
     
      <button class="close-button">Close</button>
    `;
    partyContainer.appendChild(partyDetailsElement);

    // Add event listener to close button
    const closeButton = partyDetailsElement.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      partyDetailsElement.remove();
    });
  } catch (error) {
    console.error(error);
  }
};


// Render all parties
const renderParties = async () => {
  try {
    // Clear the party container
    partyContainer.innerHTML = '';

    // Fetch all parties
    const parties = await getAllParties();

    // Render each party
    parties.forEach((party) => {
      const partyElement = document.createElement('div');
      partyElement.classList.add('party');
      partyElement.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <p>${party.date}</p>
        <p>${party.time}</p>
        <p>${party.location}</p>
        <button class="details-button" data-id="${party.id}">See Details</button>
        <button class="delete-button" data-id="${party.id}">Delete</button>
      `;
      partyContainer.appendChild(partyElement);

      // Add event listener to "see details" button
      const detailsButton = partyElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
        const partyId = event.target.dataset.id;
        await renderSinglePartyById(partyId);
      });

      // Add event listener to "delete party" button
      const deleteButton = partyElement.querySelector('.delete-button');
      deleteButton.addEventListener('click', async (event) => {
        const partyId = event.target.dataset.id;
        const success = await deleteParty(partyId);
        if (success) {
          partyElement.remove();
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// Init function
const init = async () => {
  await renderParties();
};

init();

