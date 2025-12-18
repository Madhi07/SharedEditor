import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { FaHome, FaProjectDiagram, FaDatabase, FaPlay, FaCog, FaQuestionCircle, FaChevronDown, FaEllipsisV, FaTimes, FaSpinner, FaMoon, FaSun } from 'react-icons/fa';

const API_BASE_URL = 'https://agentzee-workflow-api.episyche.com'; // Replace with your actual API URL

export default function WorkflowDashboard() {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newWorkflowName, setNewWorkflowName] = useState('');
    const [newWorkflowDesc, setNewWorkflowDesc] = useState('');

    // UI state
    const [activeTab, setActiveTab] = useState('workflows');
    const [activeSidebar, setActiveSidebar] = useState('workflows');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('lastUpdated');
    const [itemsPerPage, setItemsPerPage] = useState(50);


    const router = useRouter()


    // Load dark mode preference
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            setDarkMode(savedMode === 'true');
        }
    }, []);

    // Save dark mode preference
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    // Fetch workflows from API
    const fetchWorkflows = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/workflows/d713b249-42b5-4cb0-98a5-3089ee564560/list`);

            if (!response.ok) {
                throw new Error(`Failed to fetch workflows: ${response.statusText}`);
            }

            const data = await response.json();

            // Transform API data to match our component structure
            const transformedData = data.map(workflow => ({
                id: workflow.workflow_id,
                name: workflow.name,
                description: workflow.description,
                lastUpdated: 'Just now',
                created: 'Created today',
                active: false
            }));

            setWorkflows(transformedData);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching workflows:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load workflows on mount
    useEffect(() => {
        fetchWorkflows();
    }, [fetchWorkflows]);

    // Create new workflow
    const createWorkflow = async () => {
        if (!newWorkflowName.trim()) {
            alert('Please enter a workflow name');
            return;
        }

        try {
            setCreating(true);
            const response = await fetch(`${API_BASE_URL}/workflows/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newWorkflowName,
                    description: newWorkflowDesc,
                    user_id: "d713b249-42b5-4cb0-98a5-3089ee564560",
                    workflow_json: {}
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to create workflow: ${response.statusText}`);
            }

            // Reset form and close modal
            setNewWorkflowName('');
            setNewWorkflowDesc('');
            setShowCreateModal(false);

            // Refresh workflows list
            await fetchWorkflows();
        } catch (err) {
            alert(`Error creating workflow: ${err.message}`);
            console.error('Error creating workflow:', err);
        } finally {
            setCreating(false);
        }
    };

    // Toggle workflow active status
    const toggleWorkflowStatus = (id) => {
        setWorkflows(workflows.map(w =>
            w.id === id ? { ...w, active: !w.active } : w
        ));
    };

    // Filter workflows based on search
    const filteredWorkflows = workflows.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.description && w.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className={`${darkMode ? 'dark' : ''}`}>
            <div className="bg-white dark:bg-gray-900 font-sans min-h-screen transition-colors duration-200">
                {/* Sidebar */}
              
                {/* Main Content */}
                <main className="px">
                    {/* Header Section */}
                    <header className="border-b border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 transition-colors">Personal</h1>
                            <p className="text-gray-600 dark:text-gray-400 transition-colors">Workflows, credentials and data tables owned by you</p>
                        </div>

                        {/* Top Navigation */}
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('workflows')}
                                    className={`
                                        
                                        pb-2 transition-colors ${activeTab === 'workflows'
                                        ? 'text-gray-900 dark:text-white font-medium border-b-2 border-gray-900 dark:border-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    Workflows
                                </button>
                                <button
                                    onClick={() => setActiveTab('credentials')}
                                    className={`pb-2 transition-colors ${activeTab === 'credentials'
                                        ? 'text-gray-900 dark:text-white font-medium border-b-2 border-gray-900 dark:border-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    Credentials
                                </button>
                                <button
                                    onClick={() => setActiveTab('executions')}
                                    className={`pb-2 transition-colors ${activeTab === 'executions'
                                        ? 'text-gray-900 dark:text-white font-medium border-b-2 border-gray-900 dark:border-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    Executions
                                </button>
                                <button
                                    onClick={() => setActiveTab('datatables')}
                                    className={`pb-2 flex items-center transition-colors ${activeTab === 'datatables'
                                        ? 'text-gray-900 dark:text-white font-medium border-b-2 border-gray-900 dark:border-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    Data tables
                                    <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 transition-colors">Beta</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="
                                px-4 py-2 from-primary to-secondary bg-gradient-to-r hover:from-primary/90 hover:to-secondary/90 text-white text-sm font-medium rounded-full transition-colors flex items-center cursor-pointer
                                "
                            >
                                <span>Create Workflow</span>
                                <FaChevronDown className="text-xs" />
                            </button>
                        </div>
                    </header>

                    {/* Sub-header */}
                    <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                        <div className="mb-4">
                            <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 text-sm transition-colors">
                                Get started faster with our pre-built agents
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 transition-colors"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 transition-colors">
                                    <option>Filter</option>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 transition-colors"
                                >
                                    <option value="lastUpdated">Sort by last updated</option>
                                    <option value="name">Sort by name</option>
                                    <option value="created">Sort by created date</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="p-6 min-h-[400px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <FaSpinner className="animate-spin text-4xl text-gray-400 dark:text-gray-600" />
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <p className="text-red-600 dark:text-red-400 mb-2">Error loading workflows</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
                                    <button
                                        onClick={fetchWorkflows}
                                        className="px-4 py-2 from-primary to-secondary bg-gradient-to-r hover:from-primary/90 hover:to-secondary/90 text-white text-sm font-medium rounded-full transition-colors flex items-center cursor-pointer"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        ) : filteredWorkflows.length === 0 ? (
                            <div className="flex items-center justify-center py-20">
                                <p className="text-gray-600 dark:text-gray-400">No workflows found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredWorkflows.map((workflow) => (
                                    <div onClick={() => { router.push(`/dashboard/agents/workflow/${workflow.id}`) }} key={workflow.id} className="cursor-pointer border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex items-center justify-between transition-colors duration-200">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white transition-colors">{workflow.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                                Last updated {workflow.lastUpdated} | {workflow.created}
                                            </p>
                                            {workflow.description && (
                                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 transition-colors">{workflow.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            {/* <div className="flex items-center space-x-2">
                                                <span className={`text-sm ${workflow.active ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'} transition-colors`}>
                                                    {workflow.active ? 'Active' : 'Inactive'}
                                                </span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={workflow.active}
                                                        onChange={() => toggleWorkflowStatus(workflow.id)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600 dark:peer-checked:bg-gray-400"></div>
                                                </label>
                                            </div> */}
                                            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                                <FaEllipsisV />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Section */}
                    <footer className="border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between transition-colors duration-200">
                        <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                            Total {filteredWorkflows.length}
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <button className="w-8 h-8 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 transition-colors">
                                    1
                                </button>
                            </div>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 transition-colors"
                            >
                                <option value={50}>50/page</option>
                                <option value={25}>25/page</option>
                                <option value={100}>100/page</option>
                            </select>
                        </div>
                    </footer>
                </main>

                {/* Create Workflow Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 transition-colors duration-200">
                        <div className="bg-white dark:bg-gray-800 p-8 max-w-md w-full mx-4 transition-colors duration-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">Create New Workflow</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                                        Workflow Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newWorkflowName}
                                        onChange={(e) => setNewWorkflowName(e.target.value)}
                                        placeholder="Enter workflow name"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                                        Description
                                    </label>
                                    <textarea
                                        value={newWorkflowDesc}
                                        onChange={(e) => setNewWorkflowDesc(e.target.value)}
                                        placeholder="Enter workflow description"
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 transition-colors"
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={createWorkflow}
                                        disabled={creating}
                                        className="flex-1 px-4 py-2 from-primary to-secondary bg-gradient-to-r hover:from-primary/90 hover:to-secondary/90 text-white text-sm font-medium rounded-full transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                        {creating ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-2" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        disabled={creating}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:border-gray-500 dark:hover:border-gray-400 transition-colors disabled:opacity-50 rounded-full"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}