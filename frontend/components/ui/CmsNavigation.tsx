'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronRight, Menu, X, LayoutDashboard, FileText, Users, Settings, LogOut } from "lucide-react"
import { useAuth } from '@/app/contexts/AuthContext'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { useRouter } from 'next/navigation';

const menuData: {
  [key: string]: { name: string; icon: React.ReactNode; subItems: (string | { name: string; link: string })[] }[]
} = {
  dashboard: [
    { name: '개요', icon: <LayoutDashboard className="h-4 w-4" />, subItems: ['일일 통계', '주간 리포트', '월간 분석'] },
    { name: '실시간 모니터링', icon: <LayoutDashboard className="h-4 w-4" />, subItems: ['서버 상태', '트래픽 분석', '오류 로그'] },
  ],
  content: [
    { name: '게시물 관리', icon: <FileText className="h-4 w-4" />, subItems: ['새 게시물 작성', '게시물 목록', '카테고리 관리'] },
    { name: '미디어 라이브러리', icon: <FileText className="h-4 w-4" />, subItems: ['이미지 업로드', '비디오 관리', '파일 정리'] },
  ],
  users: [
    { name: '정책허용관리', icon: <Users className="h-4 w-4" />, subItems: [{ name: '정책허용관리', link: '/user/agree' }] },
  ],
  Blog: [
    {
      name: '블로그 관리',
      icon: <Settings className="h-4 w-4" />,
      subItems: [
        { name: '블로그 목록', link: '/blog' },
        { name: '블로그 작성', link: '/blog/write' }
      ]
    },
  ],
}

export function CmsNavigation({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { state, dispatch } = useNavigation();
  const { activeTopMenu, expandedMenu } = state;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { username, logout } = useAuth();
  const router = useRouter();

  const handleTopMenuClick = (menu: string) => {
    dispatch({ type: 'SET_ACTIVE_TOP_MENU', payload: menu });
    dispatch({ type: 'SET_EXPANDED_MENU', payload: menu });
  };

  const handleSideMenuClick = (menuName: string) => {
    if (!isSidebarCollapsed) {
      dispatch({ type: 'SET_EXPANDED_MENU', payload: expandedMenu === menuName ? null : menuName });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    if (!isSidebarCollapsed) {
      dispatch({ type: 'SET_EXPANDED_MENU', payload: null });
    }
  };

  const handleSubMenuClick = (link: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('headerMenu', activeTopMenu);
    params.set('sideMenu', expandedMenu ?? '');
    router.push(`${link}?${params.toString()}`);
  };

  return (
    <div className="flex h-screen">
      {/* Top Navigation */}
      <nav className="bg-gray-800 text-white w-full h-16 fixed top-0 left-0 flex items-center justify-between px-4 z-10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
          </Button>
          {Object.keys(menuData).map((menu) => (
            <Button
              key={menu}
              variant={activeTopMenu === menu ? "secondary" : "ghost"}
              className="mx-2"
              onClick={() => handleTopMenuClick(menu)}
            >
              {menu.charAt(0).toUpperCase() + menu.slice(1)}
            </Button>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder-avatar.jpg"
                  alt="User avatar"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.insertAdjacentHTML(
                      'beforeend',
                      '<div class="default-avatar flex items-center justify-center w-full h-full bg-gray-300 rounded-full"></div>'
                    );
                  }}
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{username ?? 'John Doe'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Side Navigation */}
      <ScrollArea
        className={`bg-gray-100 pt-16 h-full transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <nav className="p-4">
          {menuData[activeTopMenu] &&
            menuData[activeTopMenu].map((item: {
              name: string;
              icon: React.ReactNode;
              subItems: (string | { name: string; link: string })[];
            }) => (
              <div key={item.name} className="mb-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-between ${isSidebarCollapsed ? 'px-2' : 'px-4'}`}
                  onClick={() => handleSideMenuClick(item.name)}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {!isSidebarCollapsed && <span className="ml-2">{item.name}</span>}
                  </span>
                  {!isSidebarCollapsed &&
                    (expandedMenu === item.name ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                </Button>
                {!isSidebarCollapsed && expandedMenu === item.name && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.subItems.map((subItem) => (
                      <Button
                        key={typeof subItem === 'string' ? subItem : subItem.name}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleSubMenuClick(typeof subItem === 'string' ? '#' : subItem.link)}
                      >
                        {typeof subItem === 'string' ? subItem : subItem.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </nav>
      </ScrollArea>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pt-20 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}