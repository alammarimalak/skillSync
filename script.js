        const { jsPDF } = window.jspdf;
        
        document.addEventListener('DOMContentLoaded', function() {
            let skills = JSON.parse(localStorage.getItem('skills')) || [
                { 
                    id: Date.now(), 
                    name: 'Graphic Design', 
                    description: 'Creating visual content with typography, imagery, color and form.',
                    progress: 75, 
                    icon: 'paint-brush', 
                    color: 'purple' 
                },
                { 
                    id: Date.now() + 1,
                    name: 'Public Speaking', 
                    description: 'Communicating information to an audience with confidence.',
                    progress: 60, 
                    icon: 'microphone', 
                    color: 'blue' 
                },
                { 
                    id: Date.now() + 2,
                    name: 'Python Programming', 
                    description: 'Versatile language for web development, data analysis, AI.',
                    progress: 90, 
                    icon: 'code', 
                    color: 'green' 
                }
            ];
            
            renderSkills();
            
            document.getElementById('addSkillBtn').addEventListener('click', addNewSkill);
            
            document.getElementById('exportPdf').addEventListener('click', exportToPdf);
            
            document.getElementById('skillName').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') addNewSkill();
            });
            
            document.getElementById('skillDescription').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') addNewSkill();
            });
            
            function addNewSkill() {
                const nameInput = document.getElementById('skillName');
                const descInput = document.getElementById('skillDescription');
                const name = nameInput.value.trim();
                const description = descInput.value.trim();
                
                if(name !== '') {
                    const colors = ['purple', 'blue', 'green', 'yellow', 'red', 'indigo'];
                    const icons = ['paint-brush', 'microphone', 'code', 'music', 'language', 'calculator', 'camera'];
                    
                    const newSkill = {
                        id: Date.now(),
                        name: name,
                        description: description || 'No description provided.',
                        progress: 0,
                        icon: icons[Math.floor(Math.random() * icons.length)],
                        color: colors[Math.floor(Math.random() * colors.length)]
                    };
                    
                    skills.push(newSkill);
                    saveSkills();
                    renderSkills();
                    
                    nameInput.value = '';
                    descInput.value = '';
                    nameInput.focus();
                }
            }
            
            function renderSkills() {
                const container = document.getElementById('skillsContainer');
                container.innerHTML = '';
                
                if (skills.length === 0) {
                    container.innerHTML = `
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-inbox text-4xl mb-2"></i>
                            <p>No skills added yet. Add your first skill above!</p>
                        </div>
                    `;
                    return;
                }
                
                skills.forEach(skill => {
                    const skillElement = document.createElement('div');
                    skillElement.className = 'bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition';
                    skillElement.innerHTML = `
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex items-center">
                                <div class="bg-${skill.color}-100 p-2 rounded-lg mr-3">
                                    <i class="fas fa-${skill.icon} text-${skill.color}-600"></i>
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-800">${skill.name}</h3>
                                    <p class="text-sm text-gray-600">${skill.description}</p>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button class="edit-progress-btn px-2 py-1 text-xs bg-${skill.color}-100 text-${skill.color}-700 rounded hover:bg-${skill.color}-200" data-id="${skill.id}">
                                    <i class="fas fa-edit mr-1"></i> Edit
                                </button>
                                <button class="delete-btn px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200" data-id="${skill.id}">
                                    <i class="fas fa-trash-alt mr-1"></i> Delete
                                </button>
                            </div>
                        </div>
                        <div class="mt-3">
                            <div class="flex justify-between mb-1">
                                <span class="text-xs font-medium text-gray-500">Progress</span>
                                <span class="text-xs font-medium text-${skill.color}-600">${skill.progress}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="progress-bar bg-${skill.color}-600 h-2 rounded-full" style="width: ${skill.progress}%"></div>
                            </div>
                        </div>
                    `;
                    container.appendChild(skillElement);
                });
                
                document.querySelectorAll('.edit-progress-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const skillId = parseInt(this.getAttribute('data-id'));
                        const skill = skills.find(s => s.id === skillId);
                        const newProgress = prompt(`Set progress for ${skill.name} (0-100):`, skill.progress);
                        
                        if (newProgress !== null && !isNaN(newProgress)) {
                            const progressValue = Math.min(100, Math.max(0, parseInt(newProgress)));
                            skill.progress = progressValue;
                            saveSkills();
                            renderSkills();
                        }
                    });
                });
                
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const skillId = parseInt(this.getAttribute('data-id'));
                        const skill = skills.find(s => s.id === skillId);
                        
                        if (confirm(`Are you sure you want to delete "${skill.name}"?`)) {
                            skills = skills.filter(s => s.id !== skillId);
                            saveSkills();
                            renderSkills();
                        }
                    });
                });
            }
            
            function saveSkills() {
                localStorage.setItem('skills', JSON.stringify(skills));
            }
            
            async function exportToPdf() {
                const tempDiv = document.createElement('div');
                tempDiv.style.position = 'absolute';
                tempDiv.style.left = '-9999px';
                tempDiv.style.width = '600px';
                tempDiv.style.padding = '20px';
                tempDiv.style.backgroundColor = 'white';
                
                const title = document.createElement('h1');
                title.textContent = 'SkillSync Skills Report';
                title.style.fontSize = '24px';
                title.style.fontWeight = 'bold';
                title.style.marginBottom = '20px';
                title.style.textAlign = 'center';
                tempDiv.appendChild(title);
                
                const date = document.createElement('div');
                date.textContent = new Date().toLocaleDateString();
                date.style.textAlign = 'center';
                date.style.marginBottom = '30px';
                date.style.color = '#666';
                tempDiv.appendChild(date);
                
                skills.forEach(skill => {
                    const skillDiv = document.createElement('div');
                    skillDiv.style.marginBottom = '15px';
                    
                    const skillName = document.createElement('h3');
                    skillName.textContent = skill.name;
                    skillName.style.fontWeight = 'bold';
                    skillName.style.marginBottom = '5px';
                    skillName.style.fontSize = '18px';
                    skillDiv.appendChild(skillName);
                    
                    const skillDesc = document.createElement('p');
                    skillDesc.textContent = skill.description;
                    skillDesc.style.marginBottom = '5px';
                    skillDesc.style.color = '#555';
                    skillDiv.appendChild(skillDesc);
                    
                    const progressContainer = document.createElement('div');
                    progressContainer.style.display = 'flex';
                    progressContainer.style.alignItems = 'center';
                    progressContainer.style.marginTop = '5px';
                    
                    const progressText = document.createElement('span');
                    progressText.textContent = `Progress: ${skill.progress}%`;
                    progressText.style.marginRight = '10px';
                    progressText.style.minWidth = '80px';
                    progressContainer.appendChild(progressText);
                    
                    const progressBar = document.createElement('div');
                    progressBar.style.height = '10px';
                    progressBar.style.backgroundColor = '#e0e0e0';
                    progressBar.style.borderRadius = '5px';
                    progressBar.style.flexGrow = '1';
                    
                    const progressBarFill = document.createElement('div');
                    progressBarFill.style.height = '100%';
                    progressBarFill.style.width = `${skill.progress}%`;
                    progressBarFill.style.backgroundColor = '#4f46e5'; // purple-600
                    progressBarFill.style.borderRadius = '5px';
                    
                    progressBar.appendChild(progressBarFill);
                    progressContainer.appendChild(progressBar);
                    skillDiv.appendChild(progressContainer);
                    
                    tempDiv.appendChild(skillDiv);
                });
                
                document.body.appendChild(tempDiv);
                
                try {
                    const canvas = await html2canvas(tempDiv);
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const imgProps = pdf.getImageProperties(imgData);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                    
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save('my-skills-report.pdf');
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Failed to generate PDF. Please try again.');
                } finally {
                    document.body.removeChild(tempDiv);
                }
            }
        });