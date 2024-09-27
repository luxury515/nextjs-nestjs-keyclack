"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { useAuth } from '@/app/contexts/AuthContext'
const ITEMS_PER_PAGE = 10;

const memberClassTypes = [
  { id: "all", label: "전체" },
  { id: "reguler", label: "정회원" },
  { id: "master", label: "마스터" },
];

const memberTypes = [
  { id: "all", label: "전체" },
  { id: "associate", label: "준회원" },
  { id: "web", label: "정회원(웹)" },
  { id: "contract", label: "정회원(계약)" },
];

const statusTypes = [
  { id: "all", label: "전체" },
  { id: "normal", label: "정상" },
  { id: "tobe_inactive", label: "휴면예정" },
  { id: "inactive", label: "휴면" },
  { id: "suspended", label: "정지" },
];

// UserInfo 타입을 서버 응답에 맞게 수정
interface UserInfo {
  cust_no: string;
  cust_nm: string;
  cust_cls_cd: string;
  cust_stat_cd: string;
  hp: string;
  join_typ_cd: string;
  join_ymd: string;
}

export default function UserInfoPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, accessToken } = useAuth();
  const [searchFields, setSearchFields] = useState({
    eml: '',
    cust_nm: '',
    hp: '',
  });
  const [selectedMemberClassTypes, setSelectedMemberClassTypes] = useState([
    "all",
  ]);
  const [selectedMemberTypes, setSelectedMemberTypes] = useState(["all"]);
  const [selectedStatusTypes, setSelectedStatusTypes] = useState(["all"]);
  const [selectedJoinTypes, setSelectedJoinTypes] = useState(["all"]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      const body = {
        cust_nm: searchFields.cust_nm,
        eml: searchFields.eml,
        hp: searchFields.hp,
        cust_cls_cd: selectedMemberTypes.includes("all") ? [] : selectedMemberTypes,
        cust_stat_cd: selectedStatusTypes.includes("all") ? [] : selectedStatusTypes,
        jon_typ_cd: selectedJoinTypes.includes("all") ? [] : selectedJoinTypes,
      };

      console.log("요청 데이터:", { url: `/api/user/info?${queryParams.toString()}`, body });

      const response = await fetch(`/api/user/info?${queryParams.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}` // 토큰 추가
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('서버 응답:', response.status, errorText);
        throw new Error(`사용자 정보 검색에 실패했습니다. 상태 코드: ${response.status}`);
      }

      const data = await response.json();
      console.log("응답 데이터:", data);

      // 여기를 수정합니다
      setUsers(data.data);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("사용자 정보 검색 중 오류 발생:", error);
      // 사용자에게 오류 메시지 표시
      setErrorMessage("사용자 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchFields, selectedMemberTypes, selectedStatusTypes, selectedJoinTypes]);

  const handleMemberClassTypeChange = (type: string) => {
    setSelectedMemberClassTypes((prev) =>
      type === "all"
        ? ["all"]
        : prev.includes(type)
        ? prev.filter((t) => t !== type && t !== "all")
        : [...prev.filter((t) => t !== "all"), type]
    );
  };
  const handleNameChange = (field: keyof typeof searchFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFields(prev => ({ ...prev, [field]: e.target.value }));
  };
  
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );
  const handleMemberTypeChange = (type: string) => {
    setSelectedMemberTypes((prev) =>
      type === "all"
        ? ["all"]
        : prev.includes(type)
        ? prev.filter((t) => t !== type && t !== "all")
        : [...prev.filter((t) => t !== "all"), type]
    );
  };

  const handleStatusTypeChange = (type: string) => {
    setSelectedStatusTypes((prev) =>
      type === "all"
        ? ["all"]
        : prev.includes(type)
        ? prev.filter((t) => t !== type && t !== "all")
        : [...prev.filter((t) => t !== "all"), type]
    );
  };


  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => setCurrentPage(i)}
          variant={currentPage === i ? "secondary" : "outline"}
          size="sm"
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  if (!isAuthenticated) {
    return <div>Please log in to view user information.</div>;
  }

  return (
    <div className="container mx-auto p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">사용자 정보 관리</h1>

      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <h3 className="mb-2 font-semibold">회원계정구분</h3>
            <div className="flex gap-4">
              {memberClassTypes.map((type) => (
                <label key={type.id} className="flex items-center">
                  <Checkbox
                    checked={selectedMemberClassTypes.includes(type.id)}
                    onCheckedChange={() => handleMemberClassTypeChange(type.id)}
                  />
                  <span className="ml-2">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">회원 종류</h3>
            <div className="flex gap-4">
              {memberTypes.map((type) => (
                <label key={type.id} className="flex items-center">
                  <Checkbox
                    checked={selectedMemberTypes.includes(type.id)}
                    onCheckedChange={() => handleMemberTypeChange(type.id)}
                  />
                  <span className="ml-2">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">상태</h3>
            <div className="flex gap-4">
              {statusTypes.map((type) => (
                <label key={type.id} className="flex items-center">
                  <Checkbox
                    checked={selectedStatusTypes.includes(type.id)}
                    onCheckedChange={() => handleStatusTypeChange(type.id)}
                  />
                  <span className="ml-2">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
        <Input
            placeholder="이름으로 검색"
            value={searchFields.eml}
            onChange={handleNameChange('eml')}
            onKeyDown={handleKeyPress}
            className="md:w-1/4"
          />
          <Input
            placeholder="이름으로 검색"
            value={searchFields.cust_nm}
            onChange={handleNameChange('cust_nm')}
            onKeyDown={handleKeyPress}
            className="md:w-1/4"
          />
          <Input
            placeholder="폰으로 검색"
            value={searchFields.hp}
            onChange={handleNameChange('hp')}
            onKeyDown={handleKeyPress}
            className="md:w-1/4"
          />
          <Button onClick={handleSearch}>
            <Search className="md:w-1/8" /> 검색
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto w-full flex justify-center">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>회원 종류</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>가입일자</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user: UserInfo) => (
                  <TableRow key={user.cust_no}>
                    <TableCell>{user.cust_no}</TableCell>
                    <TableCell>{user.cust_nm}</TableCell>
                    <TableCell>{user.hp || '-'}</TableCell>
                    <TableCell>{user.cust_cls_cd}</TableCell>
                    <TableCell>{user.cust_stat_cd}</TableCell>
                    <TableCell>
                      {new Date(user.join_ymd).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    사용자 정보가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="mt-8 flex justify-center items-center space-x-2">
            <Button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              size="sm"
              variant="outline"
            >
              <ChevronsLeft className="h-4 w-4" />
              처음
            </Button>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              size="sm"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
              이전
            </Button>

            {renderPageNumbers()}

            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              size="sm"
              variant="outline"
            >
              다음
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              size="sm"
              variant="outline"
            >
              마지막
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
