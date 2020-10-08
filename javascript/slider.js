// fix the sliding, make the sliding velocity configurable, add ability to turn friction on or off. possible formula: 2u = v^2/stoppingDisdtance  u:friction v:velocity
// we will let the user choose the starting velocity, the stopping distance will be the width of the element, and we'll use that info to solve for the 
// friction we should be applying

// provide a default next button that doesnt require the user to download any images, and let the user use their own next button

// the amount of photos displayed should change with the width of the photocontainer's bounding rect. Add a listener for window resize that will check the
// size of the container, then check if there are too many photos by multiplying the width of the photos by the number of photos and seeing 
// if it exceeds the size of the container, and taking off as many photos as needed. Also give th user the ability to choose how resizing is handled: should the
// elements be resized, or should photos be removed? for resize: multiply the elements' size by the amount the container's size has decreased by

// Allow user to pass in a custom element, but also provide a default element

// Custom elements - what if the user is using relative units? How will our dynamic movements work then? Answer: we can use element.getBoundingClientRect(), which 
// will give us the definite size, in pixels, of the elements.

// A setup function that will run on initialization, a teardown function that allows the user to remove the slider from the page and runs 
// some function(s) in the process, and various lifecycle functions 

// dynamically add new photos to the array

class Slider {
    constructor(container, pictures, startingSize, slideVelocity = 25){
        this.container       = container
        this.startingSize    = startingSize
        this.pictures        = pictures
        this.thumbs          = []
        this.firstPass       = true
        this.slides          = 0
        this.velocity        = slideVelocity
        this.animationOffset = 0
        this.photoContainer 
        this.button          = container.getElementsByClassName('next-button')[0]
        this.workingSlideVelocity = slideVelocity
        this.createPhotoContainer()
        this.addButton()
        this.addButtonListener()
        this.addPictures()
        this.slideVelocity   = this.thumbs[0].getBoundingClientRect().width / this.velocity
        console.log(this.slideVelocity)
        this.addResizeListener()
    }

    createPhotoContainer(){
        console.log('creating photo container')
        this.photoContainer = document.createElement('div')
        this.photoContainer.classList.add('photo-container') 
        this.photoContainer.dataset.left = 0
        this.container.appendChild(this.photoContainer)
    }

    addButton(){
        this.button = document.createElement('img')
        this.button.classList.add('next-button')
        this.button.src = "./images/nextbutton.svg"
        this.container.appendChild(this.button)
    }

    addPictures(){
        this.photoContainer.dataset.left = 0;
        let i = 0
        this.pictures.forEach(p => {
            if (i < this.startingSize){let newPic = document.createElement('span')
            console.log('adding a photo')
            newPic.classList.add('thumb-container')
            newPic.innerHTML =  `
            <span class="overlay">
                <div class="icon-container"><img src="./images/user.png" alt="" class="author-icon"></div>
                <h4 class="meta-heading">emerson martinez</h4>
                <div class="line"></div>
            </span>
            <img src="${p}" alt="" class="thumb">
            `
            newPic.style.left = 0 + 'px'
            newPic.dataset.left  = 0
            this.photoContainer.appendChild(newPic)
            this.thumbs.push(newPic)}
            i ++ 
        })
    }

    addResizeListener(){
        window.onresize = function(){
            console.log('resized')
        }
    }

    fadeIn(){
        let lastThumb = this.thumbs[this.thumbs.length - 1]
        let intOp = parseInt(lastThumb.dataset.opacity)
        lastThumb.dataset.opacity = intOp
        lastThumb.dataset.opacity += 0.1
        lastThumb.style.opacity = lastThumb.dataset.opacity
        let stop = requestAnimationFrame(this.fadeIn.bind(this))
        if(lastThumb.dataset.opacity >= 1){
            cancelAnimationFrame(stop)
        }
    }

    slide(){ 
        this.photoContainer.dataset.left -= this.slideVelocity
        this.photoContainer.style.left = this.photoContainer.dataset.left + 'px'
        this.animationOffset += 10
        let stop = requestAnimationFrame(this.slide.bind(this))
        if(this.animationOffset > 150 - this.slideVelocity){
            cancelAnimationFrame(stop) 
            this.animationOffset = 0
            this.photoContainer.style.left = '0px'
            this.photoContainer.dataset.left = 0
        } 
    }

    createNewPic(newIndex){
        let newPic = document.createElement('span')
        newPic.classList.add('thumb-container')
        newPic.innerHTML =  `
        <span class="overlay">
            <div class="icon-container"><img src="./images/user.png" alt="" class="author-icon"></div>
            <h4 class="meta-heading">emerson martinez</h4>
            <div class="line"></div>
        </span>
        <img src="${this.pictures[newIndex]}" alt="" class="thumb">`
        
        return newPic
    }

    getNextItem(){
        this.slides ++ 
        let newIndex
        
        if(this.firstPass){
            newIndex = (this.startingSize-1) + this.slides
        } 
        
        if(newIndex > this.pictures.length -1){
            this.firstPass = false
            this.slides    = 0
        } 

        if (!this.firstPass){
            if(this.slides > this.pictures.length -1){
                this.slides = 0
            }
            newIndex = this.slides 
        }

        return newIndex
    }

    addAndRemove(){
        this.thumbs.splice(0,1)
        this.photoContainer.dataset.left = 150   // this needs to be dynamic
        this.photoContainer.style.left = '150px' // this needs to be dynamic

        let newPic = this.createNewPic(this.getNextItem())
        this.slide()

        this.button.style.left = '152px'; // make this dynaimcally change with the size of the photos. should be size of last thumb + 2. 
        setTimeout(()=>{
            this.photoContainer.appendChild(newPic)
            this.button.style.left = '0px'; 
        }, 50) // this delay should be configurable, and based on the slide velocity, friction

        this.photoContainer.removeChild(this.photoContainer.children[0])
        this.thumbs.push(newPic)
        
    }

    addButtonListener(){
        this.button.addEventListener('click', e => {
            this.addAndRemove()
        })
    }
}

function initSliders(){
    function r(i){
        if(i.slideVelocity) 
        {    
            return i.slideVelocity 
        } else {return}
    } 

    let i = 0
    
    window.sliders = []
    Array.from(document.getElementsByClassName('sliderize')).forEach(g => {
        let vel = r(arguments[i])
        console.log(vel)
        window.sliders[i] = new Slider(g, arguments[i].pictures, arguments[i].startingSize, vel)
        i++
    })
}