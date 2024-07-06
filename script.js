// Define Vue component for post list
Vue.component('post-list', {
    template: `
        <ul>
            <li v-for="post in posts" :key="post.id">
                <div>
                    <h3>{{ post.title }}</h3>
                    <p>{{ post.description }}</p>
                    <small>{{ post.time }}</small>
                </div>
                <button @click="deletePost(post.id)">Delete</button>
            </li>
        </ul>
    `,
    props: ['posts'],
    methods: {
        deletePost(postId) {
            this.$emit('delete', postId);
        }
    }
});
// Initialize Vue instance
const vm = new Vue({
    el: '#app',
    data: {
        newPost: {
            title: '',
            description: '',
            time: '0:00' // Initialize time for new post with zero time
        },
        editedPost: {
            id: null,
            title: '',
            description: '',
            time: '0:00' // Initialize time for edited post with zero time
        },
        showEditForm: false, // Flag to control edit form overlay
        timerInterval: null,
        currentTime: 0,
        posts: [

        ],
        originalPost: null // Store the original post being edited
    },
    methods: {
        deletePost(postId) {
            this.posts = this.posts.filter(post => post.id !== postId);
        },
        startTimer() {

            this.currentTime = 0; // Reset current time to 0
            clearInterval(this.timerInterval);
            this.timerInterval = setInterval(() => {
                this.updateTime();
            }, 1000);
        },
        continue_Timer() {
            this.timerInterval = setInterval(() => {
                this.updateTime();
            }, 1000);
        },
        stopTimer() {
            clearInterval(this.timerInterval);
        },
        updateTime() {
            this.currentTime++;
            const minutes = Math.floor(this.currentTime / 60);
            const seconds = this.currentTime % 60;

            if (!this.showEditForm) {
                // Update time for new post
                this.newPost.time = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            } else {
                // Update time for edited post
                this.editedPost.time = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            }
        },
        savePost() {
            if (this.editMode) {
                // Update existing post
                const index = this.posts.findIndex(post => post.id === this.editedPost.id);
                if (index !== -1) {
                    // Check if title or description has changed
                    if (this.editedPost.title !== this.originalPost.title || this.editedPost.description !== this.originalPost.description) {
                        this.posts[index].title = this.editedPost.title;
                        this.posts[index].description = this.editedPost.description;
                        this.posts[index].time = this.editedPost.time;
                        alert('Post updated successfully!');
                    } else {
                        alert('No changes detected.');
                        return; // Exit function if no changes detected
                    }
                }
                this.editMode = false;
                this.editedPost = { id: null, title: '', description: '', time: '0:00' }; // Reset editedPost time
                this.originalPost = null; // Reset original post
            } else {
                // Validate if necessary
                if (!this.newPost.title || !this.newPost.description) {
                    alert('Please fill out title and description.');
                    return;
                }

                // Update newPost with form values and current time
                this.posts.push({
                    id: this.posts.length + 1,
                    title: this.newPost.title,
                    description: this.newPost.description,
                    time: this.newPost.time
                });

                // Clear form fields
                this.newPost.title = '';
                this.newPost.description = '';
                this.newPost.time = '0:00'; // Reset newPost time

                // Simulate API call or local storage save
                alert('Post saved successfully!');
            }
        },
        editPost(post) {
            // Populate editedPost with the selected post's details
            this.editMode = true;
            this.editedPost.id = post.id;
            this.editedPost.title = post.title;
            this.editedPost.description = post.description;
            this.editedPost.time = post.time;

            // Store the original post being edited
            this.originalPost = {
                id: post.id,
                title: post.title,
                description: post.description
            };

            // Continue the timer
            this.currentTime = parseInt(post.time.split(':')[0]) * 60 + parseInt(post.time.split(':')[1]);
            this.continue_Timer();
        },
        updatePost() {
            // Update the existing post in the posts array
            const index = this.posts.findIndex(post => post.id === this.editedPost.id);
            if (index !== -1) {
                // Check if title or description has changed
                if (this.editedPost.title !== this.originalPost.title || this.editedPost.description !== this.originalPost.description) {
                    this.posts[index].title = this.editedPost.title;
                    this.posts[index].description = this.editedPost.description;
                    this.posts[index].time = this.editedPost.time;
                    alert('Post updated successfully!');
                } else {
                    alert('Please edit the title or description.');
                    return; // Exit function if no changes detected
                }
            }

            // Clear editedPost and hide edit form
            this.editedPost = { id: null, title: '', description: '', time: '0:00' }; // Reset editedPost time
            this.showEditForm = false;
            this.originalPost = null; // Reset original post
        },
        cancelEdit() {
            // Clear editedPost and hide edit form
            this.editedPost = { id: null, title: '', description: '', time: '0:00' }; // Reset editedPost time
            this.showEditForm = false;
            this.originalPost = null; // Reset original post
        }
    },

});