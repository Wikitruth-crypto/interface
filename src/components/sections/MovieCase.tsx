"use client"

// import { useState } from "react"
import TitleLabel from "../customer/TitleLabel"
import BlogCard from "../customer/blogCard"
import { Container } from "../Container"
// import { cn } from "@/lib/utils"
// import Image from "next/image"

const data = [
    {
        id: 1,
        title: 'The Bitcoin with financial freedom and human rights.',
        href: 'https://www.bedfordindependent.co.uk/opinion-how-a-bitcoin-conference-in-bedford-changed-the-way-i-see-financial-freedom-and-human-rights/',
        description:'Opinion: How a Bitcoin conference in Bedford changed the way I see financial freedom and human rights',
        imageUrl:'./images/blog/bitcoinConference.jpg',
        date: 'April 13 2025',
        datetime: '2025-04-13',
        category: { title: 'By Editorial Column', href: 'https://www.bedfordindependent.co.uk/opinion-how-a-bitcoin-conference-in-bedford-changed-the-way-i-see-financial-freedom-and-human-rights/' },
    },
    {
        id: 2,
        title: 'Vitalik talks about Decentralization',
        href: 'https://www.youtube.com/watch?v=jznCAlGknIo',
        description:'Why power-down is not enough. Vitalik uses Web2 lessons, governance failures, and flawed crypto design to challenge builders to focus on freedom, resilience, and true user empowerment.',
        imageUrl:'./images/blog/vitalik.jpg',
        date: 'July 3 2025',
        datetime: '2025-07-03',
        category: { title: 'Cointelegraph', href: 'https://www.youtube.com/watch?v=jznCAlGknIo' },
    },
]

/**
 * 电影案例展示列表
 * 卡片组件
 */
export default function MovieCase() {
    // const isMobile = useIsMobile()

    return (
        <section className="w-full py-8 md:py-16">
            <Container className="flex flex-col items-center justify-center space-y-8 px-0 md:px-0 ">
                {/* 标题 */}
                <TitleLabel>Movie Case</TitleLabel>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {data.map((item) => (
                        <BlogCard key={`post-blogCard-${item.id}`} post={item} />
                    ))}
                </div>

            </Container>
        </section>
    )
}





