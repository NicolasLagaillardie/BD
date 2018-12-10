data <- CanadianWeather$dailyAv[,,"Temperature.C"]
pcamatplot(dayOfYear,data,type="l",ylab="Temperatures", xlab="Day",main="Raw data")

SplineBasis <- create.bspline.basis(c(0,365),nbasis=10,norder=3)
SplineFourier <- create.fourier.basis(c(0,365),nbasis=13)

plot(SplineBasis)
plot(create.fourier.basis(c(0,365),nbasis=13))

par(mfrow=c(1,2))
smooth <- smooth.basis(dayOfYear,data,SplineFourier)
plot(smooth$fd)
matplot(dayOfYear,data,type="l",ylab="Temperatures", xlab="Day",main="Raw data")

par(mfrow=c(1,1))
plot(prcomp(data))
biplot(prcomp(data))

plot(princomp(data))
biplot(prcomp(data))

par(mfrow=c(1,4))
pcaSmooth <- pca.fd(smooth$fd,nharm=4)
plot(pcaSmooth)
pcaSmoothVar <- varmx.pca.fd(pcaSmooth)
plot(pcaSmoothVar)

par(mfrow=c(1,1))
dataKmeans <- kmeans(t(data),seq(from = 2, to = 8, by = 1),nstart=20)
plot(smooth$fd,col=dataKmeans$cluster)


par(mfrow=c(1,1))
n<-60
c<-seq(from = 1, to = n)
for (k in (1:n)) {
  c[k] <- kmeans(t(data),k,nstart=20)$tot.withinss
}
plot(seq(from = 1, to = n),c)

     