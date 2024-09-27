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
  { id: "ALL", label: "전체" },
  { id: "REGULAR", label: "정회원" },
  { id: "MASTER", label: "마스터" },
];

const memberTypes = [
  { id: "ALL", label: "전체" },
  { id: "ASSOCIATE", label: "준회원" },
  { id: "WEB", label: "정회원(웹)" },
  { id: "CONTRACT", label: "정회원(계약)" },
];

const statusTypes = [
  { id: "ALL", label: "전체" },
  { id: "NORMAL", label: "정상" },
  { id: "TOBE_INACTIVE", label: "휴면예정" },
  { id: "INACTIVE", label: "휴면" },
  { id: "SUSPENDED", label: "정지" },
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
  eml: string;
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
  const [selectedMemberClassTypes, setSelectedMemberClassTypes] = useState(["ALL"]);
  const [selectedMemberTypes, setSelectedMemberTypes] = useState(["ALL"]);
  const [selectedStatusTypes, setSelectedStatusTypes] = useState(["ALL"]);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestBody, setRequestBody] = useState({
    cust_cls_cd: [],
    join_typ_cd: [],
    cust_stat_cd: [],
  });

  // id를 label로 변환하는 함수
  const getLabel = (id: string, types: { id: string, label: string }[]) => {
    const type = types.find(t => t.id === id);
    return type ? type.label : id;
  };

  const handleSearch = useCallback(async () => {
    // 각 상태를 확인하고, 아무것도 선택되지 않았으면 "ALL"을 기본으로 설정
    setSelectedMemberClassTypes((prev) => (prev.length === 0 ? ["ALL"] : prev));
    setSelectedMemberTypes((prev) => (prev.length === 0 ? ["ALL"] : prev));
    setSelectedStatusTypes((prev) => (prev.length === 0 ? ["ALL"] : prev));

    // requestBody도 업데이트
    setRequestBody((prev) => ({
      ...prev,
      cust_cls_cd: selectedMemberClassTypes.length === 0 ? [] : prev.cust_cls_cd,
      join_typ_cd: selectedMemberTypes.length === 0 ? [] : prev.join_typ_cd,
      cust_stat_cd: selectedStatusTypes.length === 0 ? [] : prev.cust_stat_cd,
    }));

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
        ...requestBody,
      };

      console.log("요청 데이터:", { url: `/api/user/info?${queryParams.toString()}`, body });

      const response = await fetch(`/api/user/info?${queryParams.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
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

      setUsers(data.data);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("사용자 정보 검색 중 오류 발생:", error);
      setErrorMessage("사용자 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchFields, requestBody, accessToken, selectedMemberClassTypes, selectedMemberTypes, selectedStatusTypes]);

  const handleMemberClassTypeChange = (type: string) => {
    setSelectedMemberClassTypes((prev) =>
      type === "ALL"
        ? ["ALL"]
        : prev.includes(type)
        ? prev.filter((t) => t !== type && t !== "ALL")
        : [...prev.filter((t) => t !== "ALL"), type]
    );
    setRequestBody(prev => ({
      ...prev,
      cust_cls_cd: type === "ALL" 
        ? [] 
        : prev.cust_cls_cd.includes(type)
          ? prev.cust_cls_cd.filter(t => t !== type)
          : [...prev.cust_cls_cd.filter(t => t !== "ALL"), type],
    }));
  };

  const handleNameChange = (field: keyof typeof searchFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFields(prev => ({ ...prev, [field]: e.target.value }));
  };
  
  const handleMemberTypeChange = (type: string) => {
    setSelectedMemberTypes((prev) =>
      type === "ALL"
        ? ["ALL"]
        : prev.includes(type)
        ? prev.filter((t) => t !== type && t !== "ALL")
        : [...prev.filter((t) => t !== "ALL"), type]
    );
    setRequestBody(prev => ({
      ...prev,
      join_typ_cd: type === "ALL" 
        ? [] 
        : prev.join_typ_cd.includes(type)
          ? prev.join_typ_cd.filter(t => t !== type)
          : [...prev.join_typ_cd.filter(t => t !== "ALL"), type],
    }));
  };

  const handleStatusTypeChange = (type: string) => {
    setSelectedStatusTypes((prev) =>
      type === "ALL"
        ? ["ALL"]
        : prev.includes(type)
        ? prev.filter((t) => t !== type && t !== "ALL")
        : [...prev.filter((t) => t !== "ALL"), type]
    );
    setRequestBody(prev => ({
      ...prev,
      cust_stat_cd: type === "ALL" 
        ? [] 
        : prev.cust_stat_cd.includes(type)
          ? prev.cust_stat_cd.filter(t => t !== type)
          : [...prev.cust_stat_cd.filter(t => t !== "ALL"), type],
    }));
  };

  useEffect(() => {
    handleSearch();
  }, []);

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
            placeholder="이메일로 검색"
            value={searchFields.eml}
            onChange={handleNameChange('eml')}
            className="md:w-1/4"
          />
          <Input
            placeholder="이름으로 검색"
            value={searchFields.cust_nm}
            onChange={handleNameChange('cust_nm')}
            className="md:w-1/4"
          />
          <Input
            placeholder="전화번호로 검색"
            value={searchFields.hp}
            onChange={handleNameChange('hp')}
            className="md:w-1/4"
          />
          <Button onClick={handleSearch} className="md:w-1/8">
            <Search className="mr-2 h-4 w-4" /> 검색
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center">로딩 중...</div>
      ) : (
        <div className="w-full">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>전화번호</TableHead>
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
                      <TableCell>{user.eml || '-'}</TableCell>
                      <TableCell>{getLabel(user.cust_cls_cd, memberClassTypes)}</TableCell>
                      <TableCell>{getLabel(user.cust_stat_cd, statusTypes)}</TableCell>
                      <TableCell>{new Date(user.join_ymd).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      사용자 정보가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-center items-center space-x-2">
            <Button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              size="sm"
              variant="outline"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              size="sm"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="mx-2">
              {currentPage} / {totalPages}
            </span>

            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              size="sm"
              variant="outline"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              size="sm"
              variant="outline"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
