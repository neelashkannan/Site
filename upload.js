// Global configuration
const CONFIG = {
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? `http://${window.location.hostname}:3001/submit-quote-request` 
        : '/submit-quote-request', // Automatically adjusts based on environment
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB in bytes
    ALLOWED_FILE_TYPES: ['.stl', '.obj', '.step', '.stp', '.3mf']
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded - initializing file upload components');
    
    // First check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.error('Three.js library not loaded! View functionality will not work.');
        alert('3D visualization libraries could not be loaded. View functionality may not work properly.');
    } else {
        console.log('Three.js detected, continuing with initialization');
    }
    
    // Add print profile instructions to the page
    addPrintProfileInstructions();
    
    // Set up error suppression
    suppressSTLErrorIfModelVisible();
    
    // Initialize the file upload functionality
    initFileUpload();
    
    // Initialize the 3D model visualizer
    initModelVisualizer();
    
    // Initialize form submission handling
    initFormSubmission();
    
    // Initialize modal functionality
    initModal();
    
    // Initialize responsive behaviors
    initResponsiveBehaviors();
    
    console.log('All components initialized successfully');
});

// Global variables
let uploadedFiles = [];
let currentScene = null;
let currentRenderer = null;
let currentCamera = null;
let currentControls = null;
let currentModel = null;
let isRotating = false;
let rotationAnimation = null;

// Initialize file upload functionality
function initFileUpload() {
    const fileDropArea = document.getElementById('file-drop-area');
    const fileInput = document.getElementById('model-files');
    const fileList = document.getElementById('file-list');
    const fileBrowse = document.querySelector('.file-browse');
    
    if (!fileDropArea || !fileInput || !fileList) {
        console.error('File upload elements not found');
        return;
    }
    
    // Clear any existing files on page load
    fileInput.value = '';
    
    // Flag to prevent duplicate processing
    let isProcessingFiles = false;
    
    // Handle click on the browse files text
    if (fileBrowse) {
        fileBrowse.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });
    }
    
    // Handle click on the drop area
    fileDropArea.addEventListener('click', function(e) {
        // Don't trigger if we clicked on the browse text (handled above)
        if (e.target !== fileBrowse && !fileBrowse.contains(e.target)) {
            fileInput.click();
        }
    });
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, function() {
            fileDropArea.classList.add('highlight');
        }, false);
    });
    
    // Unhighlight drop area when item is dragged out or dropped
    ['dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, function() {
            fileDropArea.classList.remove('highlight');
        }, false);
    });
    
    // Handle dropped files
    fileDropArea.addEventListener('drop', function(e) {
        if (isProcessingFiles) {
            console.log('Already processing files, ignoring drop');
            return;
        }
        
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length > 0) {
            isProcessingFiles = true;
            console.log(`Files dropped: ${dt.files.length}`);
            
            try {
                processFiles(dt.files);
            } finally {
                // Always reset the processing flag, even if an error occurs
                setTimeout(() => {
                    isProcessingFiles = false;
                }, 500);
            }
        }
    }, false);
    
    // Handle selected files from file input
    fileInput.addEventListener('change', function() {
        if (isProcessingFiles) {
            console.log('Already processing files, ignoring file input change');
            return;
        }
        
        if (this.files && this.files.length > 0) {
            isProcessingFiles = true;
            console.log(`Files selected via input: ${this.files.length}`);
            
            try {
                processFiles(this.files);
            } finally {
                // Always reset the processing flag, even if an error occurs
                setTimeout(() => {
                    isProcessingFiles = false;
                    // Clear the input to allow selecting the same file again
                    this.value = '';
                }, 500);
            }
        }
    });
    
    // Prevent default drag behaviors
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Process the selected files
    function processFiles(files) {
        if (!files || files.length === 0) {
            console.log('No files to process');
            return;
        }
        
        // Show loading state on drop area
        const fileDropArea = document.getElementById('file-drop-area');
        if (fileDropArea) {
            fileDropArea.classList.add('loading');
        }
        
        console.log(`Processing ${files.length} files...`);
        
        // Track files for validation
        const validFiles = [];
        const invalidFiles = [];
        const oversizedFiles = [];
        
        // First step: Validate all files
        Array.from(files).forEach(file => {
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            const isValidType = CONFIG.ALLOWED_FILE_TYPES.includes(fileExtension);
            const isValidSize = file.size <= CONFIG.MAX_FILE_SIZE;
            
            console.log(`Validating file: ${file.name} - Type valid: ${isValidType}, Size valid: ${isValidSize}`);
            
            if (!isValidType) {
                invalidFiles.push(file.name);
            } else if (!isValidSize) {
                oversizedFiles.push(file.name);
            } else {
                validFiles.push(file);
            }
        });
        
        // Show errors if needed
        if (invalidFiles.length > 0) {
            console.log(`Invalid file types: ${invalidFiles.join(', ')}`);
            alert(`The following files have unsupported formats: ${invalidFiles.join(', ')}\n\nPlease upload STL, OBJ, STEP, or 3MF files.`);
        }
        
        if (oversizedFiles.length > 0) {
            console.log(`Oversized files: ${oversizedFiles.join(', ')}`);
            alert(`The following files exceed the ${CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB size limit: ${oversizedFiles.join(', ')}`);
        }
        
        // If no valid files, stop here
        if (validFiles.length === 0) {
            console.log('No valid files to process');
            if (fileDropArea) {
                fileDropArea.classList.remove('loading');
            }
            return;
        }
        
        console.log(`Processing ${validFiles.length} valid files...`);
        
        // Second step: Process all valid files
        let processedCount = 0;
        
        validFiles.forEach(file => {
            // Generate a unique ID for this file
            const fileId = 'file-' + Date.now() + '-' + Math.round(Math.random() * 10000);
            
            // Create file object for our tracking with default print profile
            const fileObj = {
                id: fileId,
                file: file,
                name: file.name,
                size: formatFileSize(file.size),
                type: file.name.split('.').pop().toLowerCase(),
                profile: {
                    material: '', // Default to empty to inherit from main form
                    quantity: 1,
                    color: '',    // Default to empty to inherit from main form
                    finish: '',   // Default to empty to inherit from main form
                    notes: ''
                }
            };
            
            console.log(`Adding file to upload list: ${file.name} (${fileObj.type})`);
            
            // Add to our tracking array
            uploadedFiles.push(fileObj);
            
            // Add to the visual file list
            addFileToList(fileId, file.name, formatFileSize(file.size));
            
            // Track progress
            processedCount++;
            
            // If all files processed, finish up
            if (processedCount === validFiles.length) {
                console.log('All files processed successfully');
                
                // Update the model selector
                updateModelSelector();
                
                // If this is our first file, load it for preview
                if (!currentModel && uploadedFiles.length > 0) {
                    console.log('Loading first model for preview');
                    loadModel(uploadedFiles[uploadedFiles.length - 1]);
                }
                
                // Remove loading state
                if (fileDropArea) {
                    fileDropArea.classList.remove('loading');
                }
            }
        });
    }
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Add file to the file list
    function addFileToList(fileId, fileName, fileSize) {
        console.log(`Adding file to list: ${fileName} (ID: ${fileId})`);
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileId = fileId;
        
        fileItem.innerHTML = `
            <div class="file-info">
                <span class="file-icon">📄</span>
                <span class="file-name">${fileName}</span>
                <span class="file-size">${fileSize}</span>
            </div>
            <div class="file-actions">
                <span class="file-profile" data-file-id="${fileId}">Print Profile</span>
                <span class="file-remove" data-file-id="${fileId}">×</span>
            </div>
        `;
        
        const fileList = document.getElementById('file-list');
        if (fileList) {
            fileList.appendChild(fileItem);
        } else {
            console.error('File list element not found');
            return;
        }
        
        // Add event listener for the remove button
        const removeButton = fileItem.querySelector('.file-remove');
        if (removeButton) {
            removeButton.addEventListener('click', function() {
                console.log(`Removing file: ${fileName} (ID: ${this.dataset.fileId})`);
                removeFile(this.dataset.fileId);
            });
        }
        
        // Add event listener for the print profile button
        const profileButton = fileItem.querySelector('.file-profile');
        if (profileButton) {
            profileButton.addEventListener('click', function() {
                console.log(`Opening print profile for: ${fileName} (ID: ${this.dataset.fileId})`);
                const fileId = this.dataset.fileId;
                showFilePrintProfile(fileId);
            });
        }
    }
    
    // Remove file from the list and array
    function removeFile(fileId) {
        console.log(`Removing file with ID: ${fileId}`);
        
        // Check if this is the currently displayed model
        const isCurrentModel = currentModel && 
            uploadedFiles.findIndex(f => f.id === fileId) === 
            uploadedFiles.findIndex(f => currentModel && f.id === currentModel.userData?.fileId);
        
        // Remove from the array
        uploadedFiles = uploadedFiles.filter(file => file.id !== fileId);
        
        // Remove from the list
        const fileItem = document.querySelector(`.file-item[data-file-id="${fileId}"]`);
        if (fileItem) {
            fileItem.remove();
        }
        
        // Update the model selector
        updateModelSelector();
        
        // If it was the currently loaded model, load another one or clear the viewer
        if (isCurrentModel) {
            if (uploadedFiles.length > 0) {
                loadModel(uploadedFiles[0]);
            } else {
                clearModelViewer();
            }
        }
    }
    
    // Update the model selector with the uploaded files
    function updateModelSelector() {
        const modelSelector = document.getElementById('model-selector');
        if (!modelSelector) return;
        
        // Clear the current selector
        modelSelector.innerHTML = '';
        
        if (uploadedFiles.length === 0) {
            modelSelector.innerHTML = '<p>No models uploaded</p>';
            return;
        }
        
        // Add an instruction
        const instruction = document.createElement('div');
        instruction.className = 'model-selector-instruction';
        instruction.innerHTML = '<span>Click a file below to preview:</span> <span class="selector-help">(You can rotate and zoom the preview)</span>';
        modelSelector.appendChild(instruction);
        
        // Create a container for the thumbnails
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'model-thumbnail-container';
        modelSelector.appendChild(thumbnailContainer);
        
        // Add each file as a thumbnail
        uploadedFiles.forEach(file => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'model-thumbnail';
            thumbnail.dataset.fileId = file.id;
            
            // Add file icon based on file type
            const fileIcon = document.createElement('span');
            fileIcon.className = 'model-thumbnail-icon';
            fileIcon.textContent = getFileIcon(file.type);
            thumbnail.appendChild(fileIcon);
            
            // Add file name
            const fileName = document.createElement('span');
            fileName.className = 'model-thumbnail-name';
            fileName.textContent = file.name;
            thumbnail.appendChild(fileName);
            
            // Check if this is a non-previewable type
            const nonPreviewableTypes = ['step', 'stp', '3mf'];
            const isNonPreviewable = nonPreviewableTypes.includes(file.type.toLowerCase());
            
            if (isNonPreviewable) {
                const previewLabel = document.createElement('span');
                previewLabel.className = 'preview-status limited';
                previewLabel.textContent = 'Limited Preview';
                previewLabel.title = 'This file format has limited preview capabilities';
                thumbnail.appendChild(previewLabel);
            }
            
            // If this is the current model, mark it as active
            if (currentModel && currentModel.userData && currentModel.userData.fileId === file.id) {
                thumbnail.classList.add('active');
                
                // Add "Current" indicator for currently selected model
                const currentIndicator = document.createElement('span');
                currentIndicator.className = 'current-model-indicator';
                currentIndicator.textContent = '✓';
                thumbnail.appendChild(currentIndicator);
            }
            
            thumbnail.addEventListener('click', function() {
                console.log(`Selecting model: ${file.name}`);
                
                // Remove active class from all thumbnails
                document.querySelectorAll('.model-thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                    
                    // Remove any existing current indicators
                    const indicator = thumb.querySelector('.current-model-indicator');
                    if (indicator) {
                        indicator.remove();
                    }
                });
                
                // Add active class to the clicked thumbnail
                this.classList.add('active');
                
                // Add "Current" indicator
                const currentIndicator = document.createElement('span');
                currentIndicator.className = 'current-model-indicator';
                currentIndicator.textContent = '✓';
                this.appendChild(currentIndicator);
                
                // Load the model
                const fileId = this.dataset.fileId;
                const fileObj = uploadedFiles.find(f => f.id === fileId);
                if (fileObj) {
                    // Show a message for non-previewable files before loading
                    const nonPreviewableTypes = ['step', 'stp', '3mf'];
                    if (nonPreviewableTypes.includes(fileObj.type.toLowerCase())) {
                        // Only show the message once per session for each file type
                        const key = `shown_preview_message_${fileObj.type}`;
                        if (!sessionStorage.getItem(key)) {
                            alert(`${fileObj.type.toUpperCase()} files can be uploaded but have limited preview capabilities. A placeholder will be shown.`);
                            sessionStorage.setItem(key, 'true');
                        }
                    }
                    
                    loadModel(fileObj);
                }
            });
            
            thumbnailContainer.appendChild(thumbnail);
        });
        
        // Add preview capabilities note for clarity
        const previewNote = document.createElement('div');
        previewNote.className = 'preview-note';
        previewNote.innerHTML = '<small>STL and OBJ files can be fully previewed. STEP and 3MF files have limited preview.</small>';
        modelSelector.appendChild(previewNote);
    }
    
    // Helper function to get appropriate icon for file type
    function getFileIcon(fileType) {
        switch(fileType.toLowerCase()) {
            case 'stl':
                return '🧩'; // puzzle piece
            case 'obj':
                return '🧊'; // cube
            case 'step':
            case 'stp':
                return '⚙️'; // gear
            case '3mf':
                return '📦'; // package
            default:
                return '📄'; // default document
        }
    }
}

// Initialize the 3D model visualizer
function initModelVisualizer() {
    const modelViewer = document.getElementById('model-viewer');
    
    if (!modelViewer) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, modelViewer.clientWidth / modelViewer.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(modelViewer.clientWidth, modelViewer.clientHeight);
    modelViewer.appendChild(renderer.domElement);
    
    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-1, -1, -1);
    scene.add(backLight);
    
    // Set up controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    function onWindowResize() {
        camera.aspect = modelViewer.clientWidth / modelViewer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(modelViewer.clientWidth, modelViewer.clientHeight);
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the model if rotation is enabled
        if (isRotating && currentModel) {
            currentModel.rotation.y += 0.01;
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation loop
    animate();
    
    // Store references to the Three.js objects
    currentScene = scene;
    currentRenderer = renderer;
    currentCamera = camera;
    currentControls = controls;
    
    // Set up color change functionality
    const colorPicker = document.getElementById('preview-color');
    if (colorPicker) {
        colorPicker.addEventListener('input', function() {
            changeModelColor(this.value);
        });
    }
    
    // Set up rotation toggle
    const rotateButton = document.getElementById('rotate-view');
    if (rotateButton) {
        rotateButton.addEventListener('click', function() {
            toggleRotation();
        });
    }
    
    // Set up reset view button
    const resetButton = document.getElementById('reset-view');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            resetView();
        });
    }
}

// Load 3D model
function loadModel(fileObj) {
    if (!window.THREE) {
        console.error('Three.js library not available');
        alert('3D model viewer is not available. Please refresh the page and try again.');
        return;
    }
    
    if (!currentScene || !currentRenderer || !currentCamera) {
        console.error('3D environment not initialized');
        
        // Try to reinitialize the visualizer
        console.log('Attempting to reinitialize the 3D environment');
        initModelVisualizer();
        
        // Check again after attempting reinitialization
        if (!currentScene || !currentRenderer || !currentCamera) {
            alert('3D model viewer is not properly initialized. Please refresh the page and try again.');
            return;
        }
    }
    
    console.log(`Loading model: ${fileObj.name} (${fileObj.type})`);
    
    // Show loading state
    const modelViewer = document.getElementById('model-viewer');
    if (modelViewer) {
        modelViewer.classList.add('loading');
    }
    
    // Remove current model from the scene
    if (currentModel) {
        currentScene.remove(currentModel);
        currentModel = null;
    }
    
    // Handle file types that can't be previewed
    const nonPreviewableTypes = ['step', 'stp', '3mf'];
    if (nonPreviewableTypes.includes(fileObj.type.toLowerCase())) {
        console.log(`Creating placeholder for non-previewable file type: ${fileObj.type}`);
        
        // Create a placeholder model (a simple cube) for visualization
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ 
            color: document.getElementById('preview-color')?.value || '#3498db',
            opacity: 0.7,
            transparent: true
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        const group = new THREE.Group();
        group.add(mesh);
        
        // Store file ID in the model's userData
        group.userData = { fileId: fileObj.id, isPlaceholder: true };
        
        // Add to scene
        currentScene.add(group);
        currentModel = group;
        
        // Reset view
        resetView();
        
        // Update the model selector
        updateModelSelector();
        
        // Remove loading state
        if (modelViewer) {
            modelViewer.classList.remove('loading');
        }
        
        console.log(`${fileObj.type.toUpperCase()} model added (placeholder shown): ${fileObj.name}`);
        return;
    }
    
    // For STL and OBJ files, use the appropriate loader
    try {
        const fileType = fileObj.type.toLowerCase();
        
        if (fileType === 'stl') {
            loadSTLModel(fileObj);
        } else if (fileType === 'obj') {
            loadOBJModel(fileObj);
        } else {
            throw new Error(`Unsupported file type for preview: ${fileType}`);
        }
    } catch (error) {
        console.error('Error during model loading setup:', error);
        alert(`Error preparing to load model "${fileObj.name}". Please try a different file.`);
        
        // Remove loading state
        if (modelViewer) {
            modelViewer.classList.remove('loading');
        }
    }
    
    // Function to load STL models
    function loadSTLModel(fileObj) {
        console.log(`Loading STL model: ${fileObj.name}`);
        
        // Check if STLLoader is available
        if (!THREE.STLLoader) {
            console.error('THREE.STLLoader is not available');
            alert('STL loader is not available. Please check your internet connection and refresh the page.');
            
            // Remove loading state
            const modelViewer = document.getElementById('model-viewer');
            if (modelViewer) {
                modelViewer.classList.remove('loading');
            }
            return;
        }
        
        const reader = new FileReader();
        let errorTimeout = null;
        
        reader.onload = function(event) {
            try {
                const loader = new THREE.STLLoader();
                // Try to parse the STL file
                const geometry = loader.parse(event.target.result);
                
                // If we get here, the file was parsed successfully
                console.log(`STL file parsed successfully: ${fileObj.name}`);
                
                // Check if geometry is valid before proceeding
                if (!geometry || !geometry.attributes || !geometry.attributes.position) {
                    console.error('Invalid geometry in STL file');
                    throw new Error('Invalid geometry in STL file');
                }
                
                // Get the current color from color picker
                const colorValue = document.getElementById('preview-color')?.value || '#3498db';
                
                const material = new THREE.MeshPhongMaterial({ 
                    color: colorValue, 
                    specular: 0x111111, 
                    shininess: 200 
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                
                // Center the model
                geometry.computeBoundingBox();
                const center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                mesh.position.sub(center);
                
                // Create a group to contain the model
                const group = new THREE.Group();
                group.add(mesh);
                
                // Store file ID in the model's userData
                group.userData = { fileId: fileObj.id };
                
                // Add to scene
                currentScene.add(group);
                currentModel = group;
                
                // Reset view
                resetView();
                
                // Update the model selector
                updateModelSelector();
                
                // Clear any pending error timeouts
                if (errorTimeout) {
                    clearTimeout(errorTimeout);
                    errorTimeout = null;
                }
                
                console.log(`STL model loaded successfully: ${fileObj.name}`);
                
                // Remove loading state
                const modelViewer = document.getElementById('model-viewer');
                if (modelViewer) {
                    modelViewer.classList.remove('loading');
                }
            } catch (error) {
                console.error('Error loading STL model:', error);
                
                // Remove loading state
                const modelViewer = document.getElementById('model-viewer');
                if (modelViewer) {
                    modelViewer.classList.remove('loading');
                }
                
                // Set a timeout to check if the model is visible after a short delay
                // This gives time for the renderer to possibly recover and display the model
                errorTimeout = setTimeout(() => {
                    const hasModelInScene = currentScene && currentScene.children.some(child => 
                        child.type === 'Group' && 
                        child.children.some(c => c.type === 'Mesh')
                    );
                    
                    // Only show the error if no model is visible
                    if (!hasModelInScene) {
                        alert(`Error loading the STL model "${fileObj.name}". The file may be corrupted.`);
                    } else {
                        console.log('Model appears to be loaded despite parsing error - continuing without error message');
                    }
                }, 500); // 500ms delay
            }
        };
        
        reader.onerror = function(error) {
            console.error('File reading error:', error);
            
            // Clear any pending error timeouts
            if (errorTimeout) {
                clearTimeout(errorTimeout);
                errorTimeout = null;
            }
            
            // Set a timeout to check if the model is visible after a short delay
            errorTimeout = setTimeout(() => {
                const hasModelInScene = currentScene && currentScene.children.some(child => 
                    child.type === 'Group' && 
                    child.children.some(c => c.type === 'Mesh')
                );
                
                // Only show the error if no model is visible
                if (!hasModelInScene) {
                    alert(`Error reading the file "${fileObj.name}". The file may be corrupted.`);
                }
            }, 500); // 500ms delay
            
            const modelViewer = document.getElementById('model-viewer');
            if (modelViewer) {
                modelViewer.classList.remove('loading');
            }
        };
        
        // Read as array buffer for STL files
        reader.readAsArrayBuffer(fileObj.file);
    }
    
    // Function to load OBJ models
    function loadOBJModel(fileObj) {
        console.log(`Loading OBJ model: ${fileObj.name}`);
        
        // Check if OBJLoader is available
        if (!THREE.OBJLoader) {
            console.error('THREE.OBJLoader is not available');
            alert('OBJ loader is not available. Please check your internet connection and refresh the page.');
            
            // Remove loading state
            const modelViewer = document.getElementById('model-viewer');
            if (modelViewer) {
                modelViewer.classList.remove('loading');
            }
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const loader = new THREE.OBJLoader();
                const object = loader.parse(event.target.result);
                
                // Get the current color from color picker
                const colorValue = document.getElementById('preview-color')?.value || '#3498db';
                
                // Apply material to all child meshes
                object.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshPhongMaterial({ 
                            color: colorValue, 
                            specular: 0x111111, 
                            shininess: 200 
                        });
                    }
                });
                
                // Create a group to contain the model
                const group = new THREE.Group();
                group.add(object);
                
                // Store file ID in the model's userData
                group.userData = { fileId: fileObj.id };
                
                // Add to scene
                if (currentScene) {
                    currentScene.add(group);
                    currentModel = group;
                    
                    // Reset view
                    resetView();
                    
                    // Update the model selector
                    updateModelSelector();
                    
                    console.log(`OBJ model loaded successfully: ${fileObj.name}`);
                } else {
                    throw new Error('Scene is not available');
                }
            } catch (error) {
                console.error('Error loading OBJ model:', error);
                alert(`Error loading the OBJ model "${fileObj.name}". The file may be corrupted.`);
            }
            
            // Remove loading state
            const modelViewer = document.getElementById('model-viewer');
            if (modelViewer) {
                modelViewer.classList.remove('loading');
            }
        };
        
        reader.onerror = function(error) {
            console.error('File reading error:', error);
            alert(`Error reading the file "${fileObj.name}". The file may be corrupted.`);
            
            const modelViewer = document.getElementById('model-viewer');
            if (modelViewer) {
                modelViewer.classList.remove('loading');
            }
        };
        
        // Read as text for OBJ files
        reader.readAsText(fileObj.file);
    }
}

// Clear the model viewer
function clearModelViewer() {
    if (currentModel && currentScene) {
        currentScene.remove(currentModel);
        currentModel = null;
        
        // Update renderer
        if (currentRenderer && currentScene && currentCamera) {
            currentRenderer.render(currentScene, currentCamera);
        }
    }
    
    // Update the model selector
    const modelSelector = document.getElementById('model-selector');
    if (modelSelector && uploadedFiles.length === 0) {
        modelSelector.innerHTML = '<p>No models uploaded</p>';
    }
}

// Change model color
function changeModelColor(color) {
    if (!currentModel) return;
    
    currentModel.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material.color.set(color);
        }
    });
}

// Toggle model rotation
function toggleRotation() {
    isRotating = !isRotating;
    
    const rotateButton = document.getElementById('rotate-view');
    if (rotateButton) {
        rotateButton.textContent = isRotating ? 'Stop Rotation' : 'Toggle Rotation';
    }
}

// Reset view
function resetView() {
    if (!currentModel || !currentCamera || !currentControls) return;
    
    // Calculate bounding sphere
    const box = new THREE.Box3().setFromObject(currentModel);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = currentCamera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    
    // Add a margin
    cameraZ *= 1.5;
    
    // Set camera position
    currentCamera.position.z = cameraZ;
    currentCamera.position.x = 0;
    currentCamera.position.y = 0;
    
    // Look at center of the model
    currentControls.target.copy(center);
    currentControls.update();
}

// Initialize form submission
function initFormSubmission() {
    const form = document.getElementById('upload-form');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) return;
            
            // Show loading overlay
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
            }
            
            try {
                // Prepare form data
                const formData = new FormData();
                
                // Add form fields
                const formFields = [
                    'name', 'email', 'phone', 'material', 
                    'quantity', 'color', 'finish', 'timeline', 'notes'
                ];
                
                formFields.forEach(field => {
                    const input = form.elements[field];
                    if (input) {
                        formData.append(field, input.value);
                    }
                });
                
                // Add files with their print profiles
                uploadedFiles.forEach((fileObj, index) => {
                    formData.append(`models`, fileObj.file, fileObj.name);
                    
                    // Add file-specific print profile if it exists
                    if (fileObj.profile) {
                        const profileStr = JSON.stringify({
                            material: fileObj.profile.material || form.elements['material'].value,
                            quantity: fileObj.profile.quantity || parseInt(form.elements['quantity'].value) || 1,
                            color: fileObj.profile.color || form.elements['color'].value,
                            finish: fileObj.profile.finish || form.elements['finish'].value,
                            notes: fileObj.profile.notes || ''
                        });
                        
                        formData.append(`model_profiles[${index}]`, profileStr);
                    }
                });
                
                // Add a summary of profiles for display
                const profilesSummary = {
                    global: {
                        material: form.elements['material'].value,
                        quantity: parseInt(form.elements['quantity'].value) || 1,
                        color: form.elements['color'].value,
                        finish: form.elements['finish'].value
                    },
                    perFile: uploadedFiles.map(file => ({
                        name: file.name,
                        profile: {
                            material: file.profile.material || 'Use global setting',
                            quantity: file.profile.quantity || 'Use global setting',
                            color: file.profile.color || 'Use global setting',
                            finish: file.profile.finish || 'Use global setting',
                            notes: file.profile.notes || 'None'
                        }
                    }))
                };
                
                formData.append('profiles_summary', JSON.stringify(profilesSummary));
                
                // Send data to our backend server
                console.log(`Submitting form to ${CONFIG.API_URL}`);
                
                try {
                    const response = await fetch(CONFIG.API_URL, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    // Log response details for debugging
                    console.log('Response status:', response.status, response.statusText);
                    console.log('Response headers:', 
                        Array.from(response.headers.entries())
                            .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
                    );
                    
                    // Check if response is JSON
                    const contentType = response.headers.get('content-type');
                    console.log('Content-Type:', contentType);
                    
                    let result;
                    
                    try {
                        // Clone response for potential text fallback
                        const responseClone = response.clone();
                        
                        // Attempt to parse as JSON
                        result = await response.json();
                        console.log('Successfully parsed response as JSON:', result);
                    } catch (parseError) {
                        // If JSON parsing fails, handle as text
                        console.error('Failed to parse response as JSON:', parseError);
                        
                        try {
                            const textResponse = await responseClone.text();
                            console.error('Server returned text response:', textResponse);
                            throw new Error(`Server returned an invalid response format. Status: ${response.status}`);
                        } catch (textError) {
                            throw new Error(`Could not read server response. Status: ${response.status}`);
                        }
                    }
                    
                    if (!result.success) {
                        throw new Error(result.message || 'Error submitting the form');
                    }
                    
                    console.log('Form submitted successfully:', result);
                    
                    // Update the success modal with print profiles
                    updateSuccessModalWithProfiles();
                    
                    // If the server returned information about attachments, log it
                    if (result.attachments && result.attachments !== 'none') {
                        console.log('Files attached to email:', result.attachments);
                        
                        // Update the success modal to show attachment details
                        const attachmentPlaceholder = document.querySelector('.attachment-info-placeholder');
                        if (attachmentPlaceholder) {
                            // Create attachment info element
                            const fileInfo = document.createElement('div');
                            fileInfo.className = 'attachment-info';
                            
                            // Format the file list - limit to first 3 with "and X more" if needed
                            let fileList = result.attachments.files;
                            let fileListText = '';
                            
                            if (fileList.length <= 3) {
                                fileListText = fileList.join(', ');
                            } else {
                                fileListText = `${fileList.slice(0, 3).join(', ')} and ${fileList.length - 3} more`;
                            }
                            
                            fileInfo.innerHTML = `<strong>${result.attachments.count}</strong> file${result.attachments.count > 1 ? 's' : ''} attached: ${fileListText}`;
                            attachmentPlaceholder.innerHTML = ''; // Clear any existing content
                            attachmentPlaceholder.appendChild(fileInfo);
                        }
                    }
                    
                    // Show success modal
                    const successModal = document.getElementById('success-modal');
                    if (successModal) {
                        successModal.style.display = 'flex';
                    }
                    
                    // Reset form
                    form.reset();
                    
                    // Clear file list
                    const fileList = document.getElementById('file-list');
                    if (fileList) {
                        fileList.innerHTML = '';
                    }
                    
                    // Clear uploaded files array
                    uploadedFiles = [];
                    
                    // Clear model viewer
                    clearModelViewer();
                } catch (error) {
                    console.error('Error submitting form:', error);
                    
                    // Create a more detailed error message
                    let errorMessage = error.message || 'Unknown error';
                    
                    // Check if it's a network error
                    if (!navigator.onLine) {
                        errorMessage = 'Network connection error. Please check your internet connection and try again.';
                    }
                    
                    // Display the error
                    alert('An error occurred while submitting your request: ' + errorMessage + '. Please try again or contact support.');
                } finally {
                    // Hide loading overlay
                    if (loadingOverlay) {
                        loadingOverlay.style.display = 'none';
                    }
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                
                // Create a more detailed error message
                let errorMessage = error.message || 'Unknown error';
                
                // Check if it's a network error
                if (!navigator.onLine) {
                    errorMessage = 'Network connection error. Please check your internet connection and try again.';
                }
                
                // Display the error
                alert('An error occurred while submitting your request: ' + errorMessage + '. Please try again or contact support.');
            }
        });
    }
    
    // Validate form
    function validateForm() {
        // Check if files are uploaded
        if (uploadedFiles.length === 0) {
            alert('Please upload at least one 3D model file');
            return false;
        }
        
        // Basic validation is handled by the required attribute on form fields
        return true;
    }
}

// Initialize modal functionality
function initModal() {
    const successModal = document.getElementById('success-modal');
    if (!successModal) return;
    
    // Add structure for profiles summary if it doesn't exist
    if (!successModal.querySelector('.profiles-summary')) {
        const modalContent = successModal.querySelector('.modal-content');
        if (!modalContent) return;
        
        // Create profiles summary container
        const profilesSummary = document.createElement('div');
        profilesSummary.className = 'profiles-summary';
        profilesSummary.innerHTML = `
            <h4>Print Settings Summary</h4>
            <div class="profiles-summary-global">
                <div class="profile-summary-row">
                    <span class="profile-summary-label">Material:</span>
                    <span class="profile-summary-value global-material">Not specified</span>
                </div>
                <div class="profile-summary-row">
                    <span class="profile-summary-label">Color:</span>
                    <span class="profile-summary-value global-color">Not specified</span>
                </div>
                <div class="profile-summary-row">
                    <span class="profile-summary-label">Finish:</span>
                    <span class="profile-summary-value global-finish">Not specified</span>
                </div>
            </div>
            <h4>File Settings</h4>
            <div class="profiles-summary-files">
                <p>No files uploaded</p>
            </div>
        `;
        
        // Insert before the close button
        const closeButton = modalContent.querySelector('.close-btn');
        if (closeButton) {
            modalContent.insertBefore(profilesSummary, closeButton);
        } else {
            modalContent.appendChild(profilesSummary);
        }
    }
    
    // Make sure we have a placeholder for the attachment info
    if (!successModal.querySelector('.attachment-info-placeholder')) {
        const attachmentPlaceholder = document.createElement('div');
        attachmentPlaceholder.className = 'attachment-info-placeholder';
        
        // Insert after the confirmation message
        const confirmationMsg = successModal.querySelector('.modal-content p:nth-child(4)');
        if (confirmationMsg) {
            confirmationMsg.parentNode.insertBefore(attachmentPlaceholder, confirmationMsg.nextSibling);
        }
    }
    
    // Add event listeners for the modal
    const closeModal = successModal.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    }
    
    const closeBtn = successModal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    }
    
    // Close when clicking outside the modal
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
}

// Update success modal with print profiles summary
function updateSuccessModalWithProfiles() {
    const modal = document.getElementById('success-modal');
    if (!modal) return;
    
    // Get form values for global settings
    const form = document.getElementById('upload-form');
    if (!form) return;
    
    const globalMaterial = form.elements['material'].value || 'Not specified';
    const globalColor = form.elements['color'].value || 'Not specified';
    const globalFinish = form.elements['finish'].value || 'Not specified';
    
    // Update global settings in modal
    modal.querySelector('.global-material').textContent = globalMaterial;
    modal.querySelector('.global-color').textContent = globalColor;
    modal.querySelector('.global-finish').textContent = globalFinish;
    
    // Update file-specific print profiles
    const fileProfilesContainer = modal.querySelector('.profiles-summary-files');
    if (!fileProfilesContainer) return;
    
    // Clear existing profiles
    fileProfilesContainer.innerHTML = '';
    
    // Add profiles for each file
    if (uploadedFiles.length === 0) {
        fileProfilesContainer.innerHTML = '<p>No files uploaded</p>';
        return;
    }

    // Get max files to show initially
    const maxFilesToShow = 2;
    const hasMoreFiles = uploadedFiles.length > maxFilesToShow;
    const filesToShow = hasMoreFiles ? uploadedFiles.slice(0, maxFilesToShow) : uploadedFiles;
    
    // Add visible file profiles
    filesToShow.forEach(fileObj => {
        addFileProfileToModal(fileProfilesContainer, fileObj);
    });
    
    // Add "Show more" button if needed
    if (hasMoreFiles) {
        const showMoreContainer = document.createElement('div');
        showMoreContainer.className = 'show-more-profiles';
        showMoreContainer.innerHTML = `
            <button class="show-more-btn">Show ${uploadedFiles.length - maxFilesToShow} more files</button>
        `;
        fileProfilesContainer.appendChild(showMoreContainer);
        
        // Add event listener to show more button
        const showMoreBtn = showMoreContainer.querySelector('.show-more-btn');
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', function() {
                // Hide the show more button
                showMoreContainer.style.display = 'none';
                
                // Show the remaining files
                uploadedFiles.slice(maxFilesToShow).forEach(fileObj => {
                    addFileProfileToModal(fileProfilesContainer, fileObj);
                });
            });
        }
    }
}

// Helper function to add a file profile to the modal
function addFileProfileToModal(container, fileObj) {
    const fileProfile = document.createElement('div');
    fileProfile.className = 'file-profile-item';
    
    // Determine actual settings (use global if not specified)
    const material = fileObj.profile.material || 'Use global setting';
    const quantity = fileObj.profile.quantity || 1;
    const color = fileObj.profile.color || 'Use global setting';
    const finish = fileObj.profile.finish || 'Use global setting';
    
    // Only show notes if they exist
    const hasNotes = fileObj.profile.notes && fileObj.profile.notes.trim() !== '';
    
    fileProfile.innerHTML = `
        <h5>${fileObj.name}</h5>
        <div class="profile-summary-compact">
            <span class="profile-label">Material:</span> <span class="profile-value">${material}</span> | 
            <span class="profile-label">Qty:</span> <span class="profile-value">${quantity}</span> | 
            <span class="profile-label">Color:</span> <span class="profile-value">${color}</span> | 
            <span class="profile-label">Finish:</span> <span class="profile-value">${finish}</span>
        </div>
        ${hasNotes ? `<div class="profile-notes">${fileObj.profile.notes}</div>` : ''}
    `;
    
    container.appendChild(fileProfile);
}

// Suppress error alerts for STL files if the model is visible
function suppressSTLErrorIfModelVisible() {
    // Intercept the window.alert function to check if it's an STL error
    const originalAlert = window.alert;
    window.alert = function(message) {
        if (message && typeof message === 'string' && message.includes('STL model') && message.includes('corrupted')) {
            // Check if a model is visible in the scene
            const hasVisibleModel = currentScene && currentScene.children.some(child => 
                child.type === 'Group' && 
                child.children.some(c => c.type === 'Mesh')
            );
            
            if (hasVisibleModel) {
                // Model is visible, so suppress the error
                console.log('Suppressing STL error alert because model is visible:', message);
                return;
            }
        }
        
        // Call the original alert for all other messages
        originalAlert(message);
    };
}

// Show settings modal for a specific file
function showFileSettings(fileId) {
    const fileObj = uploadedFiles.find(file => file.id === fileId);
    if (!fileObj) return;
    
    // Create modal if it doesn't exist
    let settingsModal = document.getElementById('file-settings-modal');
    if (!settingsModal) {
        settingsModal = document.createElement('div');
        settingsModal.id = 'file-settings-modal';
        settingsModal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content settings-modal-content';
        
        modalContent.innerHTML = `
            <span class="close-modal">&times;</span>
            <h3>File Print Settings</h3>
            <p class="file-settings-name"></p>
            <form id="file-settings-form" class="settings-form">
                <div class="form-group">
                    <label for="file-material">Material:</label>
                    <select id="file-material" name="material">
                        <option value="">Use global setting</option>
                        <option value="PLA">PLA</option>
                        <option value="ABS">ABS</option>
                        <option value="PETG">PETG</option>
                        <option value="TPU">TPU</option>
                        <option value="Nylon">Nylon</option>
                        <option value="Resin">Resin</option>
                        <option value="Metal">Metal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="file-quantity">Quantity:</label>
                    <input type="number" id="file-quantity" name="quantity" min="1" value="1">
                </div>
                <div class="form-group">
                    <label for="file-color">Color:</label>
                    <select id="file-color" name="color">
                        <option value="">Use global setting</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                        <option value="Yellow">Yellow</option>
                        <option value="Gray">Gray</option>
                        <option value="Custom">Custom (specify in notes)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="file-finish">Surface Finish:</label>
                    <select id="file-finish" name="finish">
                        <option value="">Use global setting</option>
                        <option value="Standard">Standard</option>
                        <option value="Smooth">Smooth</option>
                        <option value="Matte">Matte</option>
                        <option value="Glossy">Glossy</option>
                        <option value="Textured">Textured</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="file-notes">Notes:</label>
                    <textarea id="file-notes" name="notes" placeholder="Any specific requirements for this model"></textarea>
                </div>
                <div class="settings-actions">
                    <button type="submit" class="btn primary-btn">Save Settings</button>
                    <button type="button" class="btn secondary-btn close-btn">Cancel</button>
                </div>
            </form>
        `;
        
        settingsModal.appendChild(modalContent);
        document.body.appendChild(settingsModal);
        
        // Add event listeners for the modal
        const closeModal = settingsModal.querySelector('.close-modal');
        const closeBtn = settingsModal.querySelector('.close-btn');
        const settingsForm = settingsModal.querySelector('#file-settings-form');
        
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                settingsModal.style.display = 'none';
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                settingsModal.style.display = 'none';
            });
        }
        
        if (settingsForm) {
            settingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get the file ID from the form's data attribute
                const fileId = this.dataset.fileId;
                if (!fileId) return;
                
                // Find the file object
                const fileObj = uploadedFiles.find(file => file.id === fileId);
                if (!fileObj) return;
                
                // Update the file's settings
                fileObj.settings.material = document.getElementById('file-material').value;
                fileObj.settings.quantity = parseInt(document.getElementById('file-quantity').value) || 1;
                fileObj.settings.color = document.getElementById('file-color').value;
                fileObj.settings.finish = document.getElementById('file-finish').value;
                fileObj.settings.notes = document.getElementById('file-notes').value;
                
                console.log(`Updated settings for file: ${fileObj.name}`, fileObj.settings);
                
                // Mark the file item as having custom settings
                const fileItem = document.querySelector(`.file-item[data-file-id="${fileId}"]`);
                if (fileItem) {
                    // Check if any settings are different from defaults
                    const hasCustomSettings = 
                        fileObj.settings.material !== '' || 
                        fileObj.settings.quantity !== 1 || 
                        fileObj.settings.color !== '' || 
                        fileObj.settings.finish !== '' ||
                        fileObj.settings.notes !== '';
                    
                    if (hasCustomSettings) {
                        fileItem.classList.add('has-custom-settings');
                    } else {
                        fileItem.classList.remove('has-custom-settings');
                    }
                }
                
                // Close the modal
                settingsModal.style.display = 'none';
            });
        }
        
        // Close when clicking outside the modal content
        window.addEventListener('click', function(e) {
            if (e.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    }
    
    // Update the modal with the file's current settings
    const fileNameElement = settingsModal.querySelector('.file-settings-name');
    if (fileNameElement) {
        fileNameElement.textContent = fileObj.name;
    }
    
    const settingsForm = settingsModal.querySelector('#file-settings-form');
    if (settingsForm) {
        // Set the file ID on the form
        settingsForm.dataset.fileId = fileId;
        
        // Set the form values based on the file's current settings
        document.getElementById('file-material').value = fileObj.settings.material || '';
        document.getElementById('file-quantity').value = fileObj.settings.quantity || 1;
        document.getElementById('file-color').value = fileObj.settings.color || '';
        document.getElementById('file-finish').value = fileObj.settings.finish || '';
        document.getElementById('file-notes').value = fileObj.settings.notes || '';
    }
    
    // Display the modal
    settingsModal.style.display = 'flex';
}

// Add print profile instructions to the page
function addPrintProfileInstructions() {
    const uploadForm = document.getElementById('upload-form');
    if (!uploadForm) return;
    
    const fileUploadContainer = uploadForm.querySelector('.file-upload-container');
    if (!fileUploadContainer) return;
    
    // Create the instructions element
    const instructionsBox = document.createElement('div');
    instructionsBox.className = 'print-profile-instructions';
    instructionsBox.innerHTML = `
        <h4><span class="profile-icon">🖨️</span> Print Profiles</h4>
        <p>Set unique print requirements for each file:</p>
        <ol>
            <li>Upload your 3D model files below</li>
            <li>Click <strong>Print Profile</strong> next to each file to set custom material, color, finish, and quantity</li>
            <li>Preview your models by selecting them in the model visualizer to the right</li>
            <li>Each file can have different print settings, or use the global settings from the form below</li>
        </ol>
        <div class="profile-help-note">
            <span class="profile-help-icon">💡</span> <span>The form below sets the <em>default</em> settings for all files. Individual print profiles will override these settings.</span>
        </div>
    `;
    
    // Insert it before the file upload container
    fileUploadContainer.parentNode.insertBefore(instructionsBox, fileUploadContainer);
}

// Show print profile modal for a specific file
function showFilePrintProfile(fileId) {
    const fileObj = uploadedFiles.find(file => file.id === fileId);
    if (!fileObj) {
        console.error(`File with ID ${fileId} not found`);
        return;
    }
    
    console.log(`Opening print profile for file: ${fileObj.name}`);
    
    // Create modal if it doesn't exist
    let profileModal = document.getElementById('file-profile-modal');
    if (!profileModal) {
        profileModal = document.createElement('div');
        profileModal.id = 'file-profile-modal';
        profileModal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content profile-modal-content';
        
        modalContent.innerHTML = `
            <span class="close-modal">&times;</span>
            <h3>Print Profile</h3>
            
            <div class="profile-instructions">
                <p>Set specific print requirements for this file:</p>
                <ul>
                    <li>Choose <strong>Use global setting</strong> to use the main form settings</li>
                    <li>Or select custom options for just this file</li>
                    <li>Each file can have its own unique print profile</li>
                </ul>
            </div>
            
            <p class="file-profile-name"></p>
            <form id="file-profile-form" class="profile-form">
                <div class="form-group">
                    <label for="file-material">Material:</label>
                    <select id="file-material" name="material">
                        <option value="">Use global setting</option>
                        <option value="PLA">PLA</option>
                        <option value="ABS">ABS</option>
                        <option value="PETG">PETG</option>
                        <option value="TPU">TPU</option>
                        <option value="Nylon">Nylon</option>
                        <option value="Resin">Resin</option>
                        <option value="Metal">Metal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="file-quantity">Quantity:</label>
                    <input type="number" id="file-quantity" name="quantity" min="1" value="1">
                </div>
                <div class="form-group">
                    <label for="file-color">Color:</label>
                    <select id="file-color" name="color">
                        <option value="">Use global setting</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                        <option value="Yellow">Yellow</option>
                        <option value="Gray">Gray</option>
                        <option value="Custom">Custom (specify in notes)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="file-finish">Surface Finish:</label>
                    <select id="file-finish" name="finish">
                        <option value="">Use global setting</option>
                        <option value="Standard">Standard</option>
                        <option value="Smooth">Smooth</option>
                        <option value="Matte">Matte</option>
                        <option value="Glossy">Glossy</option>
                        <option value="Textured">Textured</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="file-notes">Notes:</label>
                    <textarea id="file-notes" name="notes" placeholder="Any specific requirements for this model"></textarea>
                </div>
                <div class="profile-actions">
                    <button type="submit" class="btn primary-btn">Save Profile</button>
                    <button type="button" class="btn secondary-btn close-btn">Cancel</button>
                </div>
            </form>
        `;
        
        profileModal.appendChild(modalContent);
        document.body.appendChild(profileModal);
        
        // Add event listeners for the modal
        const closeModal = profileModal.querySelector('.close-modal');
        const closeBtn = profileModal.querySelector('.close-btn');
        const profileForm = profileModal.querySelector('#file-profile-form');
        
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                profileModal.style.display = 'none';
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                profileModal.style.display = 'none';
            });
        }
        
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get the file ID from the form's data attribute
                const fileId = this.dataset.fileId;
                if (!fileId) return;
                
                // Find the file object
                const fileObj = uploadedFiles.find(file => file.id === fileId);
                if (!fileObj) return;
                
                // Update the file's print profile
                fileObj.profile.material = document.getElementById('file-material').value;
                fileObj.profile.quantity = parseInt(document.getElementById('file-quantity').value) || 1;
                fileObj.profile.color = document.getElementById('file-color').value;
                fileObj.profile.finish = document.getElementById('file-finish').value;
                fileObj.profile.notes = document.getElementById('file-notes').value;
                
                console.log(`Updated print profile for file: ${fileObj.name}`, fileObj.profile);
                
                // Mark the file item as having custom profile
                const fileItem = document.querySelector(`.file-item[data-file-id="${fileId}"]`);
                if (fileItem) {
                    // Check if any profile settings are different from defaults
                    const hasCustomProfile = 
                        fileObj.profile.material !== '' || 
                        fileObj.profile.quantity !== 1 || 
                        fileObj.profile.color !== '' || 
                        fileObj.profile.finish !== '' ||
                        fileObj.profile.notes !== '';
                    
                    if (hasCustomProfile) {
                        fileItem.classList.add('has-custom-profile');
                    } else {
                        fileItem.classList.remove('has-custom-profile');
                    }
                }
                
                // Close the modal
                profileModal.style.display = 'none';
            });
        }
        
        // Close when clicking outside the modal content
        window.addEventListener('click', function(e) {
            if (e.target === profileModal) {
                profileModal.style.display = 'none';
            }
        });
    }
    
    // Update the modal with the file's current print profile
    const fileNameElement = profileModal.querySelector('.file-profile-name');
    if (fileNameElement) {
        fileNameElement.textContent = fileObj.name;
    }
    
    const profileForm = profileModal.querySelector('#file-profile-form');
    if (profileForm) {
        // Set the file ID on the form
        profileForm.dataset.fileId = fileId;
        
        // Set the form values based on the file's current profile
        document.getElementById('file-material').value = fileObj.profile?.material || '';
        document.getElementById('file-quantity').value = fileObj.profile?.quantity || 1;
        document.getElementById('file-color').value = fileObj.profile?.color || '';
        document.getElementById('file-finish').value = fileObj.profile?.finish || '';
        document.getElementById('file-notes').value = fileObj.profile?.notes || '';
    }
    
    // Display the modal
    profileModal.style.display = 'flex';
}

// Initialize responsive behaviors
function initResponsiveBehaviors() {
    // Adjust UI based on screen size
    adjustUIForScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', function() {
        adjustUIForScreenSize();
    });
    
    // Add touch-specific enhancements for mobile
    addTouchEnhancements();
    
    // Add orientation change handler
    window.addEventListener('orientationchange', function() {
        // Short delay to allow browser to complete the orientation change
        setTimeout(function() {
            adjustUIForScreenSize();
            
            // If we have a model viewer, update its size
            if (currentRenderer && currentCamera) {
                const modelViewer = document.getElementById('model-viewer');
                if (modelViewer) {
                    currentCamera.aspect = modelViewer.clientWidth / modelViewer.clientHeight;
                    currentCamera.updateProjectionMatrix();
                    currentRenderer.setSize(modelViewer.clientWidth, modelViewer.clientHeight);
                }
            }
        }, 300);
    });
    
    // Initialize mobile navigation enhancements
    initMobileNavigation();
}

// Initialize mobile navigation enhancements
function initMobileNavigation() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    // Check if we're on a mobile device or small screen
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Force header visibility
        const header = document.querySelector('header');
        if (header) {
            header.style.display = 'flex';
            header.style.visibility = 'visible';
            header.style.opacity = '1';
        }
        
        // Add visual indicator when scrolling is possible
        const navUl = nav.querySelector('ul');
        if (navUl) {
            // Check if scrolling is possible
            const isScrollable = navUl.scrollWidth > nav.clientWidth;
            
            if (isScrollable) {
                nav.classList.add('scrollable-nav');
                
                // Add scroll indicator
                const scrollIndicator = document.createElement('div');
                scrollIndicator.className = 'nav-scroll-indicator';
                scrollIndicator.innerHTML = '→';
                
                // Only add if it doesn't exist already
                if (!document.querySelector('.nav-scroll-indicator')) {
                    nav.appendChild(scrollIndicator);
                }
                
                // Hide indicator when scrolled to the end
                navUl.addEventListener('scroll', function() {
                    const maxScroll = navUl.scrollWidth - navUl.clientWidth;
                    const currentScroll = navUl.scrollLeft;
                    
                    if (currentScroll >= maxScroll - 10) {
                        scrollIndicator.style.opacity = '0';
                    } else {
                        scrollIndicator.style.opacity = '1';
                    }
                });
            }
        }
        
        // Make sure the active link is visible
        const activeLink = nav.querySelector('.active');
        if (activeLink) {
            // Wait for the layout to settle
            setTimeout(() => {
                // Scroll to center the active link
                activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }, 100);
        }
    }
    
    // Remove outline from all navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('mousedown', function(e) {
            this.style.outline = 'none';
        });
        
        link.addEventListener('focus', function(e) {
            this.style.outline = 'none';
        });
    });
}

// Adjust UI elements based on screen size
function adjustUIForScreenSize() {
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 576;
    
    // Adjust the form layout
    const form = document.getElementById('upload-form');
    if (form) {
        if (isSmallMobile) {
            // For very small screens, ensure all elements have proper spacing
            const formGroups = form.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.style.marginBottom = '12px';
            });
        }
    }
    
    // Adjust file drop area text
    const fileDropArea = document.getElementById('file-drop-area');
    if (fileDropArea) {
        const fileTypes = fileDropArea.querySelector('.file-types');
        if (fileTypes && isSmallMobile) {
            fileTypes.textContent = 'STL, OBJ, STEP, 3MF (Max 50MB)';
        } else if (fileTypes) {
            fileTypes.textContent = 'Supported formats: STL, OBJ, STEP, 3MF (Max 50MB each)';
        }
    }
    
    // Adjust model viewer controls for touch devices
    const modelControls = document.querySelector('.model-controls');
    if (modelControls && isMobile) {
        const viewControls = modelControls.querySelector('.view-controls');
        if (viewControls) {
            viewControls.classList.add('touch-friendly');
        }
    }
}

// Add touch-specific enhancements for mobile devices
function addTouchEnhancements() {
    // Check if we're on a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        // Add touch-friendly class to the body
        document.body.classList.add('touch-device');
        
        // Make buttons more touch-friendly
        const buttons = document.querySelectorAll('.btn, .file-remove, .file-profile');
        buttons.forEach(button => {
            button.classList.add('touch-target');
        });
        
        // Improve scrolling on touch devices
        const scrollableElements = document.querySelectorAll('.model-thumbnail-container, .profiles-summary');
        scrollableElements.forEach(element => {
            element.classList.add('smooth-scroll');
            
            // Add overscroll behavior to prevent page scrolling when scrolling the element
            element.style.overscrollBehavior = 'contain';
        });
    }
} 