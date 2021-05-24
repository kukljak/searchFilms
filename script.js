class Api {
    async fetchMoviesBySearchText(text, page) {
        try {
        let search = text.replace(" ","+");
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=802cffbd6188b984d30b318313a104ec&query=${search}&page=${page}`);
        const data = res.json();
        return data;
        } catch(err) {
            console.log(err);
        }
    }
}
const api = new Api();
const list = document.querySelector("ol");
const inputData = document.querySelector("input");
const countElement = document.createElement("p");
const btn = document.createElement("button");
btn.type = "submit";
btn.textContent = "Load more";


inputData.addEventListener("keydown", async (event) => {

    if(event.key === "Enter") {
        const value = event.target.value;
        const searchREsult = await api.fetchMoviesBySearchText(value);
        const data = await searchREsult.results;

        if (data.length === 0 ){
            const info = `No results for ${event.target.value}`;           
            countElement.innerHTML = info;
            return list.append(countElement);
        } else {
            await renderMovies(searchREsult, list);
            await list.append(btn);
        }
        if (searchREsult.total_results <= 20) {
            await btn.remove();
        }
        let count = 2;
        
    btn.addEventListener("click", async (event) => {
            btn.remove();
            const res = await api.fetchMoviesBySearchText(value, count);
            renderMovies(res, list);
            if (res.page !== res.total_pages) {
                await btn.remove();
                await list.append(btn);
            }
                
            return count++
        })
        
        event.target.value = "";
     
    }
});




async function renderMovies(array, domElement){

    const result = await array;
    const data = result.results;
    countElement.innerHTML = `Results (${result.total_results})`;
    data.map((id) => {
        const element = document.createElement("li");
        element.innerHTML = `${id.original_title}`;
        domElement.prepend(countElement);
        domElement.append(element);
        
    });
    
    
};

