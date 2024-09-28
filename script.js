const fetchTopStories = async () => { 
    const response = await fetch('https://api.nytimes.com/svc/topstories/v2/world.json?api-key=F4Qx0sJW7ieEqqmLkAzoYJkGw0UMWsgt'); 
    return response.json(); 
}; 

const fetchBooks = async () => { 
    const response = await fetch('https://api.nytimes.com/svc/books/v3/reviews.json?author=Stephen+King&api-key=F4Qx0sJW7ieEqqmLkAzoYJkGw0UMWsgt'); 
    return response.json(); 
}; 

const fetchBookCover = async (isbn) => { 
    try { 
        const response = await fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`); 
        if (!response.ok) throw new Error('Cover not found'); 
        return response.url; 
    } catch (error) { 
        return 'placeholder.png'; 
    } 
}; 

const displayContent = async () => { 
    try { 
        const topStoriesData = await fetchTopStories(); 
        const booksData = await fetchBooks(); 

        const storiesGrid = document.getElementById('storiesGrid'); 
        storiesGrid.innerHTML = ''; 

        topStoriesData.results.forEach(story => { 
            const storyDiv = document.createElement('div'); 
            storyDiv.className = 'story'; 

            const image = document.createElement('img'); 
            image.src = story.multimedia && story.multimedia.length > 0 ? story.multimedia[0].url : 'default-placeholder.jpg'; 
            image.alt = story.title; 

            const storyLink = document.createElement('a'); 
            storyLink.href = story.url; 
            storyLink.target = '_blank'; 
            storyLink.innerHTML = `<h3>${story.title}</h3>`; 

            const description = document.createElement('p'); 
            description.textContent = story.abstract; 

            storyDiv.appendChild(image); 
            storyDiv.appendChild(storyLink); 
            storyDiv.appendChild(description); 
            storiesGrid.appendChild(storyDiv); 
        }); 

        const booksGrid = document.getElementById('booksGrid'); 
        booksGrid.innerHTML = ''; 

        for (const book of booksData.results) { 
            const itemDiv = document.createElement('div'); 
            itemDiv.className = 'item'; 

            const bookLink = document.createElement('a'); 
            bookLink.href = book.url; 
            bookLink.target = '_blank'; 

            const coverUrl = await fetchBookCover(book.isbn13[0]); 

            const bookImage = document.createElement('img'); 
            bookImage.src = coverUrl; 
            bookImage.alt = book.book_title; 

            bookLink.innerHTML = `<h3>${book.book_title}</h3><p>by ${book.book_author}</p>`; 
            itemDiv.appendChild(bookImage); 
            itemDiv.appendChild(bookLink); 
            booksGrid.appendChild(itemDiv); 
        } 
    } catch (error) { 
        console.error('Error displaying content:', error); 
    } 
}; 

displayContent(); 
