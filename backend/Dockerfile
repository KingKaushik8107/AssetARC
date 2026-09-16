#Build  stage for maven

FROM maven:3.8.5-openjdk-17 as build 
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean install


#Build stage for jdk

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
