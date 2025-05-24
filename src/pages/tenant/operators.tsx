"use client";

import { toast } from "sonner";
import React, { useState } from "react";
import AddOperatorModal from "@/components/add-operator-modal";
import DeleteConfirmationModal from "@/components/OperatorDeleteConfirmationModal";

interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

// Dummy data for operators
const dummyOperators: Operator[] = Array.from({ length: 45 }, (_, i) => ({
  id: `op-${1000 + i}`,
  name: `Operator ${i + 1}`,
  email: `operator${i + 1}@example.com`,
  phone: `+1${Math.floor(2000000000 + Math.random() * 8000000000)}`,
  status: i % 5 === 0 ? "inactive" : "active",
  createdAt: new Date(
    Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
  ).toISOString(),
}));

// Mock API function to fetch operators
const fetchOperators = async (
  page = 1,
  pageSize = 10
): Promise<{
  data: Operator[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: dummyOperators.slice(start, end),
    total: dummyOperators.length,
    page,
    pageSize,
    totalPages: Math.ceil(dummyOperators.length / pageSize),
  };
};

const OperatorsPage = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [operatorToDelete, setOperatorToDelete] = useState<Operator | null>(
    null
  );
  const [operatorToEdit, setOperatorToEdit] = useState<Operator | null>(null);

  // Fetch operators
  React.useEffect(() => {
    const loadOperators = async () => {
      setLoading(true);
      try {
        const response = await fetchOperators(
          pagination.page,
          pagination.pageSize
        );
        setOperators(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.total,
          totalPages: response.totalPages,
        }));
      } catch (error) {
        console.error("Error fetching operators:", error);
        toast.error("Failed to fetch operators");
      } finally {
        setLoading(false);
      }
    };

    loadOperators();
  }, [pagination.page, pagination.pageSize]);

  const handleAddOperator = (formData: {
    name: string;
    email: string;
    phone: string;
    status: string;
  }) => {
    const newOperator: Operator = {
      ...formData,
      id: `op-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
    };

    setOperators((prev) => [newOperator, ...prev.slice(0, -1)]);
    setPagination((prev) => ({
      ...prev,
      total: prev.total + 1,
      totalPages: Math.ceil((prev.total + 1) / prev.pageSize),
    }));
    toast.success("Operator added successfully");
  };

  const handleUpdateOperator = (formData: {
    name: string;
    email: string;
    phone: string;
    status: string;
  }) => {
    if (!operatorToEdit) return;

    setOperators((prev) =>
      prev.map((op) =>
        op.id === operatorToEdit.id ? { ...op, ...formData } : op
      )
    );
    toast.success("Operator updated successfully");
    setOperatorToEdit(null);
  };

  const handleDeleteOperator = () => {
    if (!operatorToDelete) return;

    setOperators((prev) => prev.filter((op) => op.id !== operatorToDelete.id));
    setPagination((prev) => ({
      ...prev,
      total: prev.total - 1,
      totalPages: Math.ceil((prev.total - 1) / prev.pageSize),
    }));
    toast.success("Operator deleted successfully");
    setIsDeleteModalOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPagination((prev) => ({ ...prev, pageSize: newSize, page: 1 }));
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Operators
        </h1>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1 px-4 py-1.5 !bg-[#e1ef46]/80 rounded-md text-sm text-gray-900 hover:bg-[#e1ef46] transition-colors"
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            ADD
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 w-full">
        {/* Operators Table */}
        <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-800 w-full">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              Loading operators...
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              {/* Operators Table */}
              <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-800">
                {loading ? (
                  <div className="p-8 text-center text-gray-400">
                    Loading operators...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead className="bg-[#2a2a2a]">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#1e1e1e] divide-y divide-gray-800">
                        {operators.map((operator) => (
                          <tr
                            key={operator.id}
                            className="hover:bg-[#2a2a2a]/50 transition-colors"
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                                  <span className="text-[#e1ef46]">
                                    {operator.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-100">
                                    {operator.name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {operator.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                              {operator.email}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                              {operator.phone}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  operator.status === "active"
                                    ? "bg-green-900/50 text-green-300"
                                    : "bg-red-900/50 text-red-300"
                                }`}
                              >
                                {operator.status.charAt(0).toUpperCase() +
                                  operator.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                              {new Date(
                                operator.createdAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  className="text-blue-400 hover:text-blue-300 p-1 transition-colors"
                                  onClick={() => setOperatorToEdit(operator)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-pencil"
                                  >
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                  </svg>
                                </button>
                                <button
                                  className="text-red-400 hover:text-red-300 p-1 transition-colors"
                                  onClick={() => {
                                    setOperatorToDelete(operator);
                                    setIsDeleteModalOpen(true);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-trash-2"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Rows per page:</span>
            <select
              value={pagination.pageSize}
              onChange={handlePageSizeChange}
              className="bg-[#2a2a2a] border border-gray-700 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#e1ef46]/50"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {`${(pagination.page - 1) * pagination.pageSize + 1}-${Math.min(
                pagination.page * pagination.pageSize,
                pagination.total
              )} of ${pagination.total}`}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-left"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-right"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add/Edit Operator Modal */}
      <AddOperatorModal
        isOpen={isAddModalOpen || !!operatorToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setOperatorToEdit(null);
        }}
        onSubmit={operatorToEdit ? handleUpdateOperator : handleAddOperator}
        initialData={operatorToEdit}
        isEditing={!!operatorToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOperator}
        operatorName={operatorToDelete?.name || ""}
      />
    </div>
  );
};

export default OperatorsPage;
