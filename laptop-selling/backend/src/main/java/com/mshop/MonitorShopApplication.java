package com.mshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableEurekaClient
public class MonitorShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(MonitorShopApplication.class, args);
	}

}
