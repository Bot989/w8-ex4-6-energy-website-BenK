// interactivity.js - Adds interactive controls to the charts
// This script adds filter buttons and interactivity to the visualizations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize controls once the DOM is fully loaded
    initializeChartControls();
});

// Main function to set up all chart controls
function initializeChartControls() {
    setupScreenSizeFilters();
    setupBrandFilters();
    setupEnergyEfficiencySlider();
    setupChartToggles();
    setupColorSchemeToggle();
    setupAnimationControls();
}

// Function to set up screen size filter buttons
function setupScreenSizeFilters() {
    // We'll enhance the existing size buttons with JavaScript interactivity
    const sizeButtons = ['All Sizes', '24"', '32"', '55"', '65"', '98"'];
    const sizesContainer = document.createElement('div');
    sizesContainer.id = 'size-filters';
    sizesContainer.className = 'filter-container';
    
    const sizeTitle = document.createElement('h3');
    sizeTitle.textContent = 'Filter by Screen Size';
    sizesContainer.appendChild(sizeTitle);
    
    // Create buttons for each size
    sizeButtons.forEach(size => {
        const button = document.createElement('button');
        button.className = 'filter-button size-filter';
        button.textContent = size;
        button.dataset.size = size;
        
        // Add active class to 'All Sizes' by default
        if (size === 'All Sizes') {
            button.classList.add('active');
        }
        
        button.addEventListener('click', function() {
            // Remove active class from all size buttons
            document.querySelectorAll('.size-filter').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter data based on selected size
            filterChartsBySize(size);
        });
        
        sizesContainer.appendChild(button);
    });
    
    // Insert before the first chart container
    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
        chartContainer.parentNode.insertBefore(sizesContainer, chartContainer);
    }
}

// Function to handle filtering charts by screen size
function filterChartsBySize(size) {
    // Show message that filtering is in progress
    const message = document.getElementById('chart-message');
    if (message) {
        message.textContent = `Filtering to show ${size} televisions...`;
        message.style.color = '#007bff';
    }
    
    // Simulate loading with a slight delay
    setTimeout(() => {
        // In a real implementation, this would filter the data and redraw the charts
        // Since we don't have the actual data here, we'll just display a message
        if (message) {
            if (size === 'All Sizes') {
                message.textContent = 'Showing all television sizes';
            } else {
                message.textContent = `Showing televisions with screen size: ${size}`;
            }
            message.style.color = 'green';
        }
        
        // Here we would call functions to update each chart with filtered data
        // For example: updateBarChart(filteredData);
    }, 500);
}

// Function to set up brand filter dropdown
function setupBrandFilters() {
    // Create container for brand filters
    const brandContainer = document.createElement('div');
    brandContainer.id = 'brand-filters';
    brandContainer.className = 'filter-container';
    
    const brandTitle = document.createElement('h3');
    brandTitle.textContent = 'Filter by Brand';
    brandContainer.appendChild(brandTitle);
    
    // Create a select dropdown for brands
    const brandSelect = document.createElement('select');
    brandSelect.id = 'brand-select';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = 'all';
    defaultOption.textContent = 'All Brands';
    brandSelect.appendChild(defaultOption);
    
    // Sample brands - in a real implementation, these would come from your data
    const sampleBrands = ['Samsung', 'LG', 'Sony', 'Hisense', 'TCL', 'Panasonic', 'Philips'];
    
    // Add options for each brand
    sampleBrands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.toLowerCase();
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
    
    // Add event listener
    brandSelect.addEventListener('change', function() {
        const selectedBrand = this.value;
        filterChartsByBrand(selectedBrand);
    });
    
    brandContainer.appendChild(brandSelect);
    
    // Insert after size filters or before chart container
    const sizesContainer = document.getElementById('size-filters');
    if (sizesContainer) {
        sizesContainer.parentNode.insertBefore(brandContainer, sizesContainer.nextSibling);
    } else {
        const chartContainer = document.getElementById('chart-container');
        if (chartContainer) {
            chartContainer.parentNode.insertBefore(brandContainer, chartContainer);
        }
    }
}

// Function to handle filtering charts by brand
function filterChartsByBrand(brand) {
    const message = document.getElementById('chart-message');
    if (message) {
        if (brand === 'all') {
            message.textContent = 'Showing televisions from all brands';
        } else {
            message.textContent = `Showing televisions from ${brand.charAt(0).toUpperCase() + brand.slice(1)}`;
        }
        message.style.color = 'green';
    }
    
    // Here we would call functions to update each chart with filtered data
    // For example: updateBarChart(filteredData);
}

// Function to set up energy efficiency slider
function setupEnergyEfficiencySlider() {
    // Create container for energy efficiency slider
    const sliderContainer = document.createElement('div');
    sliderContainer.id = 'energy-slider-container';
    sliderContainer.className = 'filter-container';
    
    const sliderTitle = document.createElement('h3');
    sliderTitle.textContent = 'Filter by Maximum Energy Consumption (kWh/year)';
    sliderContainer.appendChild(sliderTitle);
    
    // Create slider elements
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'slider-wrapper';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'energy-slider';
    slider.min = '100';
    slider.max = '1000';
    slider.step = '50';
    slider.value = '1000';
    
    const sliderValue = document.createElement('span');
    sliderValue.id = 'slider-value';
    sliderValue.textContent = '1000 kWh/year';
    
    sliderWrapper.appendChild(slider);
    sliderWrapper.appendChild(sliderValue);
    sliderContainer.appendChild(sliderWrapper);
    
    // Add event listener
    slider.addEventListener('input', function() {
        sliderValue.textContent = `${this.value} kWh/year`;
        filterChartsByEnergy(this.value);
    });
    
    // Insert after brand filters or before chart container
    const brandContainer = document.getElementById('brand-filters');
    if (brandContainer) {
        brandContainer.parentNode.insertBefore(sliderContainer, brandContainer.nextSibling);
    } else {
        const chartContainer = document.getElementById('chart-container');
        if (chartContainer) {
            chartContainer.parentNode.insertBefore(sliderContainer, chartContainer);
        }
    }
}

// Function to handle filtering charts by maximum energy consumption
function filterChartsByEnergy(maxEnergy) {
    const message = document.getElementById('chart-message');
    if (message) {
        message.textContent = `Showing televisions with energy consumption up to ${maxEnergy} kWh/year`;
        message.style.color = 'green';
    }
    
    // Here we would call functions to update each chart with filtered data
    // For example: updateBarChart(filteredData);
}

// Function to set up chart type toggle buttons
function setupChartToggles() {
    // Create container for chart toggles
    const toggleContainer = document.createElement('div');
    toggleContainer.id = 'chart-toggles';
    toggleContainer.className = 'filter-container';
    
    const toggleTitle = document.createElement('h3');
    toggleTitle.textContent = 'Choose Chart Type';
    toggleContainer.appendChild(toggleTitle);
    
    // Create toggle buttons for different charts
    const chartTypes = ['Bar Chart', 'Line Chart', 'Pie Chart'];
    const chartIds = ['bar-chart', 'line-chart', 'pie-chart'];
    
    chartTypes.forEach((type, index) => {
        const button = document.createElement('button');
        button.className = 'filter-button chart-toggle';
        button.textContent = type;
        button.dataset.chart = chartIds[index];
        
        // Set first button as active by default
        if (index === 0) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', function() {
            // Remove active class from all toggle buttons
            document.querySelectorAll('.chart-toggle').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Toggle chart visibility
            toggleChartVisibility(this.dataset.chart);
        });
        
        toggleContainer.appendChild(button);
    });
    
    // Insert before the first chart container
    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
        chartContainer.parentNode.insertBefore(toggleContainer, chartContainer);
    }
    
    // Initially hide line and pie charts
    document.querySelectorAll('#line-chart-container, #pie-chart-container').forEach(container => {
        if (container) {
            container.style.display = 'none';
        }
    });
}

// Function to handle toggling chart visibility
function toggleChartVisibility(chartId) {
    // Hide all chart containers
    const chartContainers = [
        document.getElementById('chart-container'),
        document.getElementById('line-chart-container'),
        document.getElementById('pie-chart-container')
    ];
    
    chartContainers.forEach(container => {
        if (container) {
            container.style.display = 'none';
        }
    });
    
    // Show the selected chart container
    switch (chartId) {
        case 'bar-chart':
            if (chartContainers[0]) chartContainers[0].style.display = 'block';
            break;
        case 'line-chart':
            if (chartContainers[1]) chartContainers[1].style.display = 'block';
            break;
        case 'pie-chart':
            if (chartContainers[2]) chartContainers[2].style.display = 'block';
            break;
    }
}

// Function to set up color scheme toggle
function setupColorSchemeToggle() {
    // Create container for color scheme toggle
    const colorContainer = document.createElement('div');
    colorContainer.id = 'color-scheme-toggle';
    colorContainer.className = 'filter-container';
    
    const colorTitle = document.createElement('h3');
    colorTitle.textContent = 'Chart Color Scheme';
    colorContainer.appendChild(colorTitle);
    
    // Create toggle buttons for different color schemes
    const colorSchemes = ['Default', 'Cool', 'Warm', 'Contrast'];
    const colorClasses = ['default-colors', 'cool-colors', 'warm-colors', 'contrast-colors'];
    
    colorSchemes.forEach((scheme, index) => {
        const button = document.createElement('button');
        button.className = 'filter-button color-toggle';
        button.textContent = scheme;
        button.dataset.colors = colorClasses[index];
        
        // Set first button as active by default
        if (index === 0) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', function() {
            // Remove active class from all color toggle buttons
            document.querySelectorAll('.color-toggle').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply color scheme
            applyColorScheme(this.dataset.colors);
        });
        
        colorContainer.appendChild(button);
    });
    
    // Insert after chart toggles
    const toggleContainer = document.getElementById('chart-toggles');
    if (toggleContainer) {
        toggleContainer.parentNode.insertBefore(colorContainer, toggleContainer.nextSibling);
    }
}

// Function to apply color scheme to charts
function applyColorScheme(colorClass) {
    // Define color palettes for different schemes
    const colorPalettes = {
        'default-colors': ['steelblue', '#4682b4', '#5f9ea0', '#6495ed', '#4169e1'],
        'cool-colors': ['#4b9cd3', '#117a65', '#76d7c4', '#85929e', '#5499c7'],
        'warm-colors': ['#ff7f0e', '#e74c3c', '#f39c12', '#d35400', '#c0392b'],
        'contrast-colors': ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00']
    };
    
    const colors = colorPalettes[colorClass];
    
    // Apply colors to bar chart
    d3.selectAll('.bar')
        .transition()
        .duration(1000)
        .attr('fill', colors[0]);
    
    // Apply colors to line chart
    d3.select('.line')
        .transition()
        .duration(1000)
        .attr('stroke', colors[1]);
    
    d3.selectAll('.data-point')
        .transition()
        .duration(1000)
        .attr('fill', colors[1]);
    
    // For pie chart, would need to update the color scale
    // This is just a placeholder as we don't have access to the pie chart code
    
    const message = document.getElementById('chart-message');
    if (message) {
        message.textContent = `Applied ${colorClass.replace('-colors', '')} color scheme`;
        message.style.color = 'green';
    }
}

// Function to set up animation controls
function setupAnimationControls() {
    // Create container for animation controls
    const animationContainer = document.createElement('div');
    animationContainer.id = 'animation-controls';
    animationContainer.className = 'filter-container';
    
    const animationTitle = document.createElement('h3');
    animationTitle.textContent = 'Animation Controls';
    animationContainer.appendChild(animationTitle);
    
    // Create animation buttons
    const buttons = [
        { text: 'Animate Bar Chart', action: 'animate-bars' },
        { text: 'Sort by Energy', action: 'sort-energy' },
        { text: 'Sort by Size', action: 'sort-size' },
        { text: 'Reset', action: 'reset' }
    ];
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'filter-button animation-button';
        button.textContent = btn.text;
        button.dataset.action = btn.action;
        
        button.addEventListener('click', function() {
            triggerAnimation(this.dataset.action);
        });
        
        animationContainer.appendChild(button);
    });
    
    // Insert at the end
    const homeContent = document.getElementById('home-content');
    if (homeContent) {
        homeContent.appendChild(animationContainer);
    }
}

// Function to handle animations
function triggerAnimation(action) {
    const message = document.getElementById('chart-message');
    
    switch (action) {
        case 'animate-bars':
            // Animate bars growing from zero to full height
            d3.selectAll('.bar')
                .transition()
                .duration(1000)
                .attr('width', 0)
                .transition()
                .duration(1500)
                .attr('width', function() {
                    return d3.select(this).attr('width');
                });
            
            if (message) {
                message.textContent = 'Animating bar chart...';
                message.style.color = '#007bff';
            }
            break;
            
        case 'sort-energy':
            if (message) {
                message.textContent = 'Sorting chart by energy consumption...';
                message.style.color = '#007bff';
            }
            // This would sort the data and redraw the chart
            // Since we don't have access to your actual data, this is just a placeholder
            break;
            
        case 'sort-size':
            if (message) {
                message.textContent = 'Sorting chart by screen size...';
                message.style.color = '#007bff';
            }
            // This would sort the data and redraw the chart
            // Since we don't have access to your actual data, this is just a placeholder
            break;
            
        case 'reset':
            if (message) {
                message.textContent = 'Resetting all charts to default state...';
                message.style.color = '#007bff';
            }
            
            // Reset all filters and charts
            document.querySelectorAll('.size-filter')[0].click();
            document.getElementById('brand-select').value = 'all';
            document.getElementById('energy-slider').value = 1000;
            document.getElementById('slider-value').textContent = '1000 kWh/year';
            document.querySelectorAll('.chart-toggle')[0].click();
            document.querySelectorAll('.color-toggle')[0].click();
            
            setTimeout(() => {
                if (message) {
                    message.textContent = 'Charts reset to default state';
                    message.style.color = 'green';
                }
            }, 500);
            break;
    }
}

// Add some CSS for the interactive elements
function addFilterStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .filter-container {
            margin: 20px 0;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .filter-container h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #333;
        }
        
        .filter-button {
            margin: 5px;
            padding: 8px 12px;
            background-color: #e9ecef;
            border: 1px solid #ced4da;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .filter-button:hover {
            background-color: #dee2e6;
        }
        
        .filter-button.active {
            background-color: #007bff;
            color: white;
            border-color: #0056b3;
        }
        
        #brand-select {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ced4da;
            min-width: 200px;
        }
        
        .slider-wrapper {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        #energy-slider {
            flex-grow: 1;
        }
        
        #slider-value {
            min-width: 120px;
            font-weight: bold;
        }
        
        .animation-button {
            background-color: #6c757d;
            color: white;
            border-color: #5a6268;
        }
        
        .animation-button:hover {
            background-color: #5a6268;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Call this function to add the styles
addFilterStyles();