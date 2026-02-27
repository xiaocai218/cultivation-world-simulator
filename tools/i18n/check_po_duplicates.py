#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查 po 文件中是否有重复的 msgid"""

import re
import sys
from pathlib import Path
from collections import Counter
import polib


def extract_msgids(filepath: Path) -> list[str]:
    """
    从 po 文件中提取所有 msgid
    
    Args:
        filepath: po 文件路径
        
    Returns:
        msgid 列表
    """
    po = polib.pofile(str(filepath))
    msgids = [entry.msgid for entry in po if entry.msgid]
    return msgids


def find_duplicates(msgids: list[str]) -> dict[str, int]:
    """
    找出重复的 msgid
    
    Args:
        msgids: msgid 列表
        
    Returns:
        字典，键为重复的 msgid，值为出现次数
    """
    counter = Counter(msgids)
    duplicates = {msgid: count for msgid, count in counter.items() if count > 1}
    return duplicates


def check_file(filepath: Path, lang_name: str) -> tuple[int, dict[str, int]]:
    """
    检查单个 po 文件
    
    Args:
        filepath: po 文件路径
        lang_name: 语言名称（用于显示）
        
    Returns:
        (msgid总数, 重复项字典)
    """
    print(f"\n{'='*60}")
    print(f"检查文件: {lang_name}")
    print(f"路径: {filepath}")
    print(f"{'='*60}")
    
    if not filepath.exists():
        print(f"[ERROR] 文件不存在")
        return 0, {}
    
    msgids = extract_msgids(filepath)
    print(f"总共找到 {len(msgids)} 个 msgid 条目")
    
    duplicates = find_duplicates(msgids)
    
    if duplicates:
        print(f"\n[WARNING] 发现 {len(duplicates)} 个重复的 msgid:")
        for msgid, count in sorted(duplicates.items()):
            print(f"  - '{msgid}' 出现了 {count} 次")
    else:
        print(f"\n[OK] 未发现重复的 msgid")
    
    return len(msgids), duplicates


def main():
    """主函数"""
    # 获取项目根目录
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    
    # po 文件路径
    zh_file = project_root / "static" / "locales" / "zh-CN" / "LC_MESSAGES" / "messages.po"
    tw_file = project_root / "static" / "locales" / "zh-TW" / "LC_MESSAGES" / "messages.po"
    en_file = project_root / "static" / "locales" / "en-US" / "LC_MESSAGES" / "messages.po"
    
    # 检查中文文件
    zh_count, zh_dups = check_file(zh_file, "中文 (zh_CN)")
    
    # 检查繁体中文文件
    tw_count, tw_dups = check_file(tw_file, "繁体中文 (zh_TW)")
    
    # 检查英文文件
    en_count, en_dups = check_file(en_file, "英文 (en_US)")
    
    # 打印总结
    print(f"\n{'='*60}")
    print("检查总结")
    print(f"{'='*60}")
    
    has_error = False
    
    if zh_dups or tw_dups or en_dups:
        print("[ERROR] 发现重复条目，需要修复")
        has_error = True
    else:
        print("[OK] 所有文件都没有重复的 msgid")
    
    if len({zh_count, tw_count, en_count}) != 1:
        print(f"[WARNING] msgid 数量不一致: zh-CN {zh_count} 个, zh-TW {tw_count} 个, en-US {en_count} 个")
        has_error = True
    else:
        print(f"[OK] 所有语言 msgid 数量一致: {zh_count} 个")
    
    # 检查 msgid 键是否匹配
    if zh_count > 0 and tw_count > 0 and en_count > 0:
        zh_msgids = set(extract_msgids(zh_file))
        tw_msgids = set(extract_msgids(tw_file))
        en_msgids = set(extract_msgids(en_file))
        
        all_msgids = zh_msgids | tw_msgids | en_msgids
        
        zh_missing = all_msgids - zh_msgids
        tw_missing = all_msgids - tw_msgids
        en_missing = all_msgids - en_msgids
        
        if zh_missing:
            print(f"\n[WARNING] zh-CN 缺失的 msgid ({len(zh_missing)} 个):")
            for msgid in sorted(zh_missing)[:5]:
                print(f"  - '{msgid}'")
            if len(zh_missing) > 5:
                print(f"  ... 还有 {len(zh_missing) - 5} 个")
            has_error = True

        if tw_missing:
            print(f"\n[WARNING] zh-TW 缺失的 msgid ({len(tw_missing)} 个):")
            for msgid in sorted(tw_missing)[:5]:
                print(f"  - '{msgid}'")
            if len(tw_missing) > 5:
                print(f"  ... 还有 {len(tw_missing) - 5} 个")
            has_error = True
        
        if en_missing:
            print(f"\n[WARNING] en-US 缺失的 msgid ({len(en_missing)} 个):")
            for msgid in sorted(en_missing)[:5]:
                print(f"  - '{msgid}'")
            if len(en_missing) > 5:
                print(f"  ... 还有 {len(en_missing) - 5} 个")
            has_error = True
        
        if not zh_missing and not tw_missing and not en_missing:
            print("[OK] 所有语言的 msgid 键完全匹配")
    
    # 返回状态码
    return 1 if has_error else 0


if __name__ == "__main__":
    sys.exit(main())
